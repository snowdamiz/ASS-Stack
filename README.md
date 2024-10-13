# The ASS Stack

Unleash your side projects or startups with the ASS stack – the ultimate arse-enal for rapid development. Say goodbye to tedious boilerplate and hello to a kickass foundation where the hard choices are already made for you. It’s not fully polished, but who needs perfection when you’re building something epic? Dive in, experiment, and use at your own risk. Let’s get your ideas off the ground with some serious attitude.

### Out of the Box
- [x] Database, backed up automatically to any S3 bucket via Litestream (Amazon S3, Cloudflare R2, etc)
- [x] Basic session based authentication. (switching to 0Auth or 2fa highly recommended)
- [x] Already Dockerized
- [ ] Coolify deploy script

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [1. Set up environment variables](#1-set-up-environment-variables)
  - [2. Install dependencies](#2-install-dependencies)
  - [3. Generate database schema](#3-generate-database-schema)
- [Usage](#usage)
  - [Run with Docker Compose](#run-with-docker-compose)
  - [Run locally without Docker](#run-locally-without-docker)

## Features

- **Astro Framework**: Fast and lightweight web framework.
- **Server Islands**: Server-side rendering with partial hydration.
- **Drizzle ORM**: Type-safe SQL query builder.
- **SQLite with Litestream**: Reliable data replication.
- **Tailwind CSS**: Utility-first CSS framework.
- **Dockerized Deployment**: Easy containerization and scaling.

## Tech Stack

- **Front-end**: Astro, Vue.js, Tailwind CSS
- **Back-end**: Node.js, SQLite, Drizzle ORM
- **Deployment**: Docker, Docker Compose, Litestream
- **Utilities**: Coolify, Shadcn UI components

## Prerequisites

- **Node.js**: v16 or later
- **Docker**: v20 or later
- **Docker Compose**: v1.29 or later

## Installation

### 1. Set up environment variables

```bash
cp .env.example .env
```

All variables are required for the application to function.

### 2. Install dependencies

```bash
npm install
```

### 3. Generate database schema

```bash
npm run generate
```

This command will generate the database schema based on the `drizzle` directory.

## Usage

### Run with Docker Compose

```bash
docker-compose up -d
```

The application will be available at `http://localhost:4321`.

### Run locally without Docker

```bash
npm run dev
```

The application will be available at `http://localhost:4321`.
