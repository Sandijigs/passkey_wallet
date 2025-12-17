;; Passkey Smart Wallet - Clarity 4
;; A seedless wallet using WebAuthn/Passkey authentication
;; 
;; Clarity 4 Features Used:
;; - secp256r1-verify: Verify passkey signatures (WebAuthn uses P-256 curve)
;; - stacks-block-time: Time-locked recovery and session management
;; - restrict-assets?: Protect wallet assets during external calls
;; - to-ascii?: Generate human-readable transaction receipts

;; ============================================
;; CONSTANTS
;; ============================================

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u1001))
(define-constant ERR_INVALID_SIGNATURE (err u1002))
(define-constant ERR_WALLET_EXISTS (err u1003))
(define-constant ERR_WALLET_NOT_FOUND (err u1004))
(define-constant ERR_RECOVERY_NOT_READY (err u1005))
(define-constant ERR_RECOVERY_EXPIRED (err u1006))
(define-constant ERR_INSUFFICIENT_BALANCE (err u1007))
(define-constant ERR_INVALID_GUARDIAN (err u1008))
(define-constant ERR_SESSION_EXPIRED (err u1009))
(define-constant ERR_NONCE_MISMATCH (err u1010))
(define-constant ERR_TRANSFER_FAILED (err u1011))

;; Time constants (in seconds)
(define-constant RECOVERY_DELAY u259200) ;; 3 days in seconds
(define-constant RECOVERY_WINDOW u86400) ;; 24 hours to complete recovery
(define-constant SESSION_DURATION u3600) ;; 1 hour session validity

;; ============================================
;; DATA STRUCTURES
;; ============================================

;; Main wallet storage
(define-map wallets
  { wallet-id: (buff 32) }
  {
    owner-pubkey: (buff 33),           ;; secp256r1 public key (compressed)
    guardian-pubkey: (optional (buff 33)), ;; Optional recovery guardian
    created-at: uint,
    nonce: uint,
    is-locked: bool
  }
)

;; Wallet balances (STX)
(define-map wallet-balances
  { wallet-id: (buff 32) }
  { balance: uint }
)

;; Recovery requests
(define-map recovery-requests
  { wallet-id: (buff 32) }
  {
    new-pubkey: (buff 33),
    initiated-at: uint,
    initiated-by: (buff 33)
  }
)

;; Active sessions for gas-efficient batch operations
(define-map active-sessions
  { wallet-id: (buff 32), session-id: (buff 32) }
  {
    expires-at: uint,
    permissions: uint  ;; Bitmap of allowed operations
  }
)

;; Transaction history (last 10 per wallet)
(define-map transaction-log
  { wallet-id: (buff 32), tx-index: uint }
  {
    tx-type: (string-ascii 20),
    amount: uint,
    recipient: (optional principal),
    timestamp: uint,
    description: (string-ascii 150)
  }
)

(define-map wallet-tx-count
  { wallet-id: (buff 32) }
  { count: uint }
)

;; ============================================
;; READ-ONLY FUNCTIONS
;; ============================================

;; Get wallet details
(define-read-only (get-wallet (wallet-id (buff 32)))
  (map-get? wallets { wallet-id: wallet-id })
)

;; Get wallet balance
(define-read-only (get-balance (wallet-id (buff 32)))
  (default-to { balance: u0 }
    (map-get? wallet-balances { wallet-id: wallet-id })
  )
)

;; Check if recovery is pending
(define-read-only (get-recovery-request (wallet-id (buff 32)))
  (map-get? recovery-requests { wallet-id: wallet-id })
)

;; Get current block timestamp using Clarity 4's stacks-block-time
(define-read-only (get-current-time)
  stacks-block-time
)

;; Check if session is valid
(define-read-only (is-session-valid (wallet-id (buff 32)) (session-id (buff 32)))
  (match (map-get? active-sessions { wallet-id: wallet-id, session-id: session-id })
    session (< stacks-block-time (get expires-at session))
    false
  )
)

;; Generate transaction receipt string using to-ascii?
(define-read-only (generate-receipt (wallet-id (buff 32)) (tx-type (string-ascii 20)) (amount uint))
  (let
    (
      (time-str (unwrap-panic (to-ascii? stacks-block-time)))
      (amount-str (unwrap-panic (to-ascii? amount)))
    )
    (concat 
      (concat "TX:" tx-type)
      (concat "|AMT:" 
        (concat amount-str 
          (concat "|TIME:" time-str)
        )
      )
    )
  )
)

;; ============================================
;; PUBLIC FUNCTIONS
;; ============================================

;; Create a new passkey wallet
;; @param wallet-id: Unique identifier (hash of passkey credential ID)
;; @param owner-pubkey: secp256r1 public key from passkey (33 bytes compressed)
(define-public (create-wallet 
    (wallet-id (buff 32)) 
    (owner-pubkey (buff 33))
  )
  (begin
    ;; Check wallet doesn't already exist
    (asserts! (is-none (map-get? wallets { wallet-id: wallet-id })) ERR_WALLET_EXISTS)
    
    ;; Create the wallet
    (map-set wallets
      { wallet-id: wallet-id }
      {
        owner-pubkey: owner-pubkey,
        guardian-pubkey: none,
        created-at: stacks-block-time,
        nonce: u0,
        is-locked: false
      }
    )
    
    ;; Initialize balance
    (map-set wallet-balances
      { wallet-id: wallet-id }
      { balance: u0 }
    )
    
    ;; Initialize transaction count
    (map-set wallet-tx-count
      { wallet-id: wallet-id }
      { count: u0 }
    )

    ;; Event logging for monitoring
    (print {event: "wallet-created", wallet-id: wallet-id, owner: tx-sender, timestamp: stacks-block-time})
    (ok wallet-id)
  )
)

;; Deposit STX into wallet
(define-public (deposit (wallet-id (buff 32)) (amount uint))
  (begin
    (asserts! (is-some (map-get? wallets { wallet-id: wallet-id })) ERR_WALLET_NOT_FOUND)

    (let
      (
        (current-balance (get balance (get-balance wallet-id)))
        (sender tx-sender)
      )
      ;; Transfer STX from sender to contract
      ;; User sends to contract, so we receive in as-contract? context
      (try! (as-contract? ((with-stx amount))
        ;; Body must not return response - just do the transfer
        ;; tx-sender inside as-contract? is the contract address
        (begin
          (unwrap-panic (stx-transfer? amount sender tx-sender))
          amount  ;; Return non-response value
        )
      ))

      ;; Update balance
      (map-set wallet-balances
        { wallet-id: wallet-id }
        { balance: (+ current-balance amount) }
      )

      ;; Log transaction
      (unwrap! (log-transaction wallet-id "DEPOSIT" amount none) ERR_TRANSFER_FAILED)

      ;; Event logging for monitoring
      (print {event: "deposit", wallet-id: wallet-id, amount: amount, sender: sender})
      (ok amount)
    )
  )
)

;; Withdraw STX with passkey signature verification
;; Uses secp256r1-verify for WebAuthn signature validation
(define-public (withdraw 
    (wallet-id (buff 32))
    (amount uint)
    (recipient principal)
    (message-hash (buff 32))
    (signature (buff 64))
    (nonce uint)
  )
  (let
    (
      (wallet (unwrap! (map-get? wallets { wallet-id: wallet-id }) ERR_WALLET_NOT_FOUND))
      (current-balance (get balance (get-balance wallet-id)))
      (owner-pubkey (get owner-pubkey wallet))
      (expected-nonce (get nonce wallet))
    )
    ;; Verify nonce
    (asserts! (is-eq nonce expected-nonce) ERR_NONCE_MISMATCH)
    
    ;; Verify wallet is not locked
    (asserts! (not (get is-locked wallet)) ERR_UNAUTHORIZED)
    
    ;; Verify signature using Clarity 4's secp256r1-verify
    ;; This validates the WebAuthn/Passkey signature
    (asserts! (secp256r1-verify message-hash signature owner-pubkey) ERR_INVALID_SIGNATURE)
    
    ;; Check sufficient balance
    (asserts! (>= current-balance amount) ERR_INSUFFICIENT_BALANCE)

    ;; Transfer STX from contract to recipient using Clarity 4's as-contract?
    (try! (as-contract? ((with-stx amount))
      ;; Body must not return response - just do the transfer
      (begin
        (unwrap-panic (stx-transfer? amount tx-sender recipient))
        amount  ;; Return non-response value
      )
    ))

    ;; Update balance
    (map-set wallet-balances
      { wallet-id: wallet-id }
      { balance: (- current-balance amount) }
    )

    ;; Increment nonce
    (map-set wallets
      { wallet-id: wallet-id }
      (merge wallet { nonce: (+ expected-nonce u1) })
    )

    ;; Log transaction
    (unwrap! (log-transaction wallet-id "WITHDRAW" amount (some recipient)) ERR_TRANSFER_FAILED)

    ;; Event logging for monitoring
    (print {event: "withdraw", wallet-id: wallet-id, amount: amount, recipient: recipient, nonce: (+ expected-nonce u1)})
    (ok amount)
  )
)

;; Set a recovery guardian (backup passkey or trusted contact)
(define-public (set-guardian
    (wallet-id (buff 32))
    (guardian-pubkey (buff 33))
    (message-hash (buff 32))
    (signature (buff 64))
  )
  (let
    (
      (wallet (unwrap! (map-get? wallets { wallet-id: wallet-id }) ERR_WALLET_NOT_FOUND))
      (owner-pubkey (get owner-pubkey wallet))
    )
    ;; Verify owner signature
    (asserts! (secp256r1-verify message-hash signature owner-pubkey) ERR_INVALID_SIGNATURE)
    
    ;; Update guardian
    (map-set wallets
      { wallet-id: wallet-id }
      (merge wallet { guardian-pubkey: (some guardian-pubkey) })
    )
    
    (ok true)
  )
)

;; Initiate recovery process (time-locked using stacks-block-time)
(define-public (initiate-recovery
    (wallet-id (buff 32))
    (new-pubkey (buff 33))
    (message-hash (buff 32))
    (signature (buff 64))
  )
  (let
    (
      (wallet (unwrap! (map-get? wallets { wallet-id: wallet-id }) ERR_WALLET_NOT_FOUND))
      (guardian-pubkey (unwrap! (get guardian-pubkey wallet) ERR_INVALID_GUARDIAN))
    )
    ;; Verify guardian signature
    (asserts! (secp256r1-verify message-hash signature guardian-pubkey) ERR_INVALID_SIGNATURE)
    
    ;; Create recovery request with time-lock
    (map-set recovery-requests
      { wallet-id: wallet-id }
      {
        new-pubkey: new-pubkey,
        initiated-at: stacks-block-time,
        initiated-by: guardian-pubkey
      }
    )
    
    ;; Lock the wallet during recovery
    (map-set wallets
      { wallet-id: wallet-id }
      (merge wallet { is-locked: true })
    )
    
    (ok stacks-block-time)
  )
)

;; Complete recovery after time-lock expires
(define-public (complete-recovery (wallet-id (buff 32)))
  (let
    (
      (wallet (unwrap! (map-get? wallets { wallet-id: wallet-id }) ERR_WALLET_NOT_FOUND))
      (recovery (unwrap! (map-get? recovery-requests { wallet-id: wallet-id }) ERR_RECOVERY_NOT_READY))
      (initiated-at (get initiated-at recovery))
      (recovery-ready-at (+ initiated-at RECOVERY_DELAY))
      (recovery-expires-at (+ recovery-ready-at RECOVERY_WINDOW))
    )
    ;; Check if recovery delay has passed (using stacks-block-time)
    (asserts! (>= stacks-block-time recovery-ready-at) ERR_RECOVERY_NOT_READY)
    
    ;; Check if recovery window hasn't expired
    (asserts! (<= stacks-block-time recovery-expires-at) ERR_RECOVERY_EXPIRED)
    
    ;; Update wallet with new owner
    (map-set wallets
      { wallet-id: wallet-id }
      (merge wallet { 
        owner-pubkey: (get new-pubkey recovery),
        is-locked: false,
        nonce: u0
      })
    )
    
    ;; Clear recovery request
    (map-delete recovery-requests { wallet-id: wallet-id })
    
    ;; Log recovery
    (unwrap! (log-transaction wallet-id "RECOVERY" u0 none) ERR_TRANSFER_FAILED)
    
    (ok true)
  )
)

;; Cancel recovery (owner can cancel if they regain access)
(define-public (cancel-recovery
    (wallet-id (buff 32))
    (message-hash (buff 32))
    (signature (buff 64))
  )
  (let
    (
      (wallet (unwrap! (map-get? wallets { wallet-id: wallet-id }) ERR_WALLET_NOT_FOUND))
      (owner-pubkey (get owner-pubkey wallet))
    )
    ;; Verify owner signature
    (asserts! (secp256r1-verify message-hash signature owner-pubkey) ERR_INVALID_SIGNATURE)
    
    ;; Clear recovery request
    (map-delete recovery-requests { wallet-id: wallet-id })
    
    ;; Unlock wallet
    (map-set wallets
      { wallet-id: wallet-id }
      (merge wallet { is-locked: false })
    )
    
    (ok true)
  )
)

;; Create a time-limited session for batch operations
(define-public (create-session
    (wallet-id (buff 32))
    (session-id (buff 32))
    (permissions uint)
    (message-hash (buff 32))
    (signature (buff 64))
  )
  (let
    (
      (wallet (unwrap! (map-get? wallets { wallet-id: wallet-id }) ERR_WALLET_NOT_FOUND))
      (owner-pubkey (get owner-pubkey wallet))
      (expires-at (+ stacks-block-time SESSION_DURATION))
    )
    ;; Verify owner signature
    (asserts! (secp256r1-verify message-hash signature owner-pubkey) ERR_INVALID_SIGNATURE)
    
    ;; Create session
    (map-set active-sessions
      { wallet-id: wallet-id, session-id: session-id }
      {
        expires-at: expires-at,
        permissions: permissions
      }
    )
    
    (ok expires-at)
  )
)

;; ============================================
;; PRIVATE FUNCTIONS
;; ============================================

;; Log transaction to history
(define-private (log-transaction 
    (wallet-id (buff 32)) 
    (tx-type (string-ascii 20))
    (amount uint)
    (recipient (optional principal))
  )
  (let
    (
      (tx-count-data (default-to { count: u0 } (map-get? wallet-tx-count { wallet-id: wallet-id })))
      (current-count (get count tx-count-data))
      (tx-index (mod current-count u10)) ;; Circular buffer of 10
    )
    ;; Log the transaction
    (map-set transaction-log
      { wallet-id: wallet-id, tx-index: tx-index }
      {
        tx-type: tx-type,
        amount: amount,
        recipient: recipient,
        timestamp: stacks-block-time,
        description: (generate-receipt wallet-id tx-type amount)
      }
    )
    
    ;; Update count
    (map-set wallet-tx-count
      { wallet-id: wallet-id }
      { count: (+ current-count u1) }
    )
    
    (ok true)
  )
)
