<p a>
  <img src="https://dummyimage.com/80x80/000/ffffff&text=MV" alt="Miskve Logo" width="50" style="vertical-align: middle; border-radius: 8px;"/>
  <span style="font-size: 1.8em; font-weight: 600; margin-left: 12px; vertical-align: middle;">Miskve</span>
</p>

*Inspired by the simplicity of nature and human intuition, Miskve is a Web3 loyalty app that rewards coffee lovers for their habits...*

---

## What Do We Do?

We are building a loyalty application where users earn **Web3-based points (tokens)** by **scanning QR codes** during purchases at physical stores.  
These points are defined as digital assets on the Stellar blockchain and are transferable.

---

## What Problem Are We Solving?

Traditional loyalty systems:
- Are tied to centralized structures.
- Points can expire or be non-transferable.
- User data is stored in insecure environments.

**We turn this system into a transparent, secure, and user-owned model using Web3.**

---

## Target Audience

- **Small businesses** → Increase customer retention via loyalty programs.  
- **Users** → Control over their points in a transparent system.

---

## Why Is It Important?

- Builds trust with users.  
- Turns loyalty points into tangible digital assets.  
- Empowers small businesses to compete with large chains.

---

## Value Proposition

- Points **cannot be deleted**, they **belong to the user**.  
- Businesses can **customize** their reward system.  
- Points are **transferable** and **decentralized**.  
- Web3 infrastructure is presented **intuitively** to users.

---

## App Flow

### 1. User Flow

```mermaid
flowchart TD
    A[User Opens App] --> B{Scans QR Code?}
    B -->|Yes| C[Read Store ID & Token Amount]
    C --> D[Send Request to Server]
    D --> E{Valid Transaction?}
    E -->|Yes| F[Transfer Tokens to User Wallet]
    F --> G[Update Balance]
    G --> H[Log Transaction History]
    E -->|No| I[Show Transaction Rejected Warning]
    B -->|No| J[Return to Home Screen]
  ```
 ### 2. Merchant Flow
  ```mermaid
  flowchart LR
    K[Merchant Logs In] --> L[Generate QR Code]
    L --> M[Set Token Amount]
    M --> N[Set Time Limit]
    N --> O[Display Code on Screen]
    O --> P[Token Transfer When User Scans]

  ```
 ### 3. System Sequence
  ```mermaid
  sequenceDiagram
    participant U as User
    participant A as Miskve App
    participant S as Server
    participant B as Blockchain

    U->>A: Scan QR Code
    A->>S: Send Validation Request
    S->>B: Query Smart Contract
    B-->>S: Approval/Reject Response
    S-->>A: Return Result
    A->>U: Show Result
    alt Successful Transaction
        S->>B: Token Transfer
        B-->>S: Confirmation
        S->>A: Update Balance
    end


  ```
### 4. Data Model – Class Structure

```mermaid
classDiagram
    class User {
        +id: String
        +publicKey: String
        +tokenBalance: Number
        +getBalance()
        +makeTransfer()
    }

    class Merchant {
        +id: String
        +name: String
        +tokenRate: Number
        +generateQR()
    }

    class Transaction {
        +id: String
        +date: DateTime
        +amount: Number
        +status: String
    }

    User "1" --> "n" Transaction
    Merchant "1" --> "n" Transaction


  ```
 
### 5. General State

  ```mermaid
stateDiagram-v2
    [*] --> Home
    Home --> Scan_QR: User Selects Scan QR
    Scan_QR --> Validate_Transaction: QR Scanned
    Validate_Transaction --> Success: Validation Passed
    Validate_Transaction --> Failure: Validation Failed
    Success --> Update_Balance
    Update_Balance --> Log_Transaction
    Log_Transaction --> Home
    Failure --> Show_Error
    Show_Error --> Home

  ```

## Quick Start
   ```bash
    git clone https://github.com/kullaniciadi/proje-adi.git
    cd proje-adi
    pnpm install
    pnpm run dev
  ```

## Features

- Reward system via QR code scanning
- Coffee/point tokens defined on Stellar blockchain
- View balance using Stellar/Soroban wallet or backend
- REST API for balance and transaction history
- Smart contract deployed on testnet
- Simple and user-friendly UI

## Tech Stack

- Stellar/SorobanSDK
- React/Next.js
- Passkey Kit
- Tailwind CSS
- Actix-Web
- PostgreSQL + SQLx
- .env 
- Serde, Chrono, Uuid

## Teams

- Yunuscan Yüz - Back-End Devloper
- Ayşenur Aydın - Front-End Devloper
- Uğur Koray Göydağ - UI/Designer
- Gökhan Şimşek - UI/Designer
