# Privacy-Preserving Athlete Matchmaking System

A secure **Next.js + Prisma + PostgreSQL** based matchmaking platform
designed for managing athletes, verifying eligibility, and creating
match requests while preserving sensitive data using cryptographic
techniques.

------------------------------------------------------------------------

# Project Overview

This application allows coaches or administrators to:

-   Register and login securely
-   Manage athlete profiles
-   Request matches between athletes
-   Verify athlete eligibility
-   Perform compatibility checks using homomorphic encryption
-   Track user activity through audit logs
-   Monitor system statistics via dashboard

The platform focuses on **privacy-preserving computation and
transparency**.

------------------------------------------------------------------------

# Tech Stack

## Frontend

-   Next.js (App Router)
-   React
-   Tailwind CSS

## Backend

-   Next.js API Routes
-   Prisma ORM

## Database

-   PostgreSQL

## Authentication

-   JWT (JSON Web Token)
-   bcrypt password hashing

## Security / Privacy

-   Paillier Homomorphic Encryption
-   SHA256 proof verification
-   Activity audit logging

------------------------------------------------------------------------

# Database Schema

## User

Stores administrator or coach accounts.

Fields: - id - email - firstName - lastName - password - createdAt

------------------------------------------------------------------------

## Athlete

Represents athlete profiles.

Fields:

-   id
-   firstName
-   lastName
-   gender
-   dateOfBirth
-   weightClass
-   licenseId (unique)
-   medicalOk
-   createdAt
-   updatedAt

------------------------------------------------------------------------

## MatchRequest

Stores requests to match athletes.

Fields:

-   id
-   createdAt
-   status (pending, approved, rejected)
-   reason
-   requestedById

------------------------------------------------------------------------

## RequestedAthlete

Join table between MatchRequest and Athlete.

Fields:

-   matchRequestId
-   athleteId

------------------------------------------------------------------------

## ActivityLog

Audit logging table.

Fields:

-   id
-   action
-   metadata
-   userId
-   createdAt

------------------------------------------------------------------------

# Core Features

## Authentication System

-   User registration
-   Secure login
-   JWT authentication
-   Protected API routes

------------------------------------------------------------------------

## Athlete Management

Administrators can:

-   Create athlete profiles
-   Track medical eligibility
-   Manage athlete records

------------------------------------------------------------------------

## Match Request System

Allows administrators to:

-   Create match requests
-   Approve or reject match requests
-   Track match status

------------------------------------------------------------------------

## Privacy Preserving Compatibility Check

The system uses **Paillier Homomorphic Encryption** to perform encrypted
compatibility calculations.

Benefits:

-   Sensitive data remains encrypted
-   Secure matchmaking analysis
-   Privacy protection

------------------------------------------------------------------------

## Eligibility Verification

Eligibility proof is generated using:

licenseId + medical status

This ensures the athlete is eligible without exposing sensitive medical
data.

------------------------------------------------------------------------

## Audit Logging

Every important action is logged.

Examples:

-   User login
-   Match request creation
-   Eligibility verification
-   Compatibility checks

------------------------------------------------------------------------

# API Routes

All API routes are located in:

src/app/api/

------------------------------------------------------------------------

## Authentication

### Register

POST /api/auth/register

Creates a new user.

------------------------------------------------------------------------

### Login

POST /api/auth/login

Returns JWT token.

------------------------------------------------------------------------

## Athletes

### Get Athletes

GET /api/athletes

Returns list of athletes.

------------------------------------------------------------------------

## Match Requests

### Get Match Requests

GET /api/match-requests

Returns all match requests.

------------------------------------------------------------------------

### Create Match Request

POST /api/match-requests

Creates a new match request.

------------------------------------------------------------------------

### Update Match Request

PATCH /api/match-requests/{id}

Approve or reject request.

------------------------------------------------------------------------

## Eligibility

POST /api/verify-eligibility

Verifies athlete eligibility.

------------------------------------------------------------------------

## Compatibility

POST /api/compatibility-check

Runs encrypted compatibility analysis.

------------------------------------------------------------------------

## Logs

GET /api/logs

Returns system activity logs.

------------------------------------------------------------------------

## Dashboard

GET /api/dashboard-stats

Returns statistics such as:

-   total athletes
-   total match requests
-   system activity

------------------------------------------------------------------------

# Project Structure

## Project Structure

```text
src
├── app
│   ├── api
│   │   ├── athletes
│   │   ├── auth
│   │   ├── compatibility-check
│   │   ├── dashboard-stats
│   │   ├── logs
│   │   ├── match-requests
│   │   └── verify-eligibility
│   │
│   ├── dashboard
│   │   ├── athletes
│   │   ├── audit-logs
│   │   ├── eligibility
│   │   ├── matchmaking
│   │   └── match-requests
│   │
│   ├── login
│   │
│   └── register
│
├── components
│   ├── ProtectedRoute
│   └── dashboard
│
├── hooks
│   └── usePageTitle
│
└── lib
    ├── prisma
    ├── jwt
    ├── logger
    └── paillierEncryption
```
------------------------------------------------------------------------

# Environment Variables

Create a `.env` file:

DATABASE_URL=postgresql://user:password@localhost:5432/database
JWT_SECRET=your_secret_key

------------------------------------------------------------------------

# Security

This system includes:

-   bcrypt password hashing
-   JWT authentication
-   audit logging
-   encrypted compatibility checks
-   eligibility proof verification
