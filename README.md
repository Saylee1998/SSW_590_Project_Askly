### Askly
A minimal Q&A forum platform built with modern DevSecOps practices, focusing on simplicity, collaboration, and community-driven knowledge sharing.

#### 👥 Team Members
* Dhruvish Parekh
* Parin Patel
* Saylee Waje

#### 📚 Course Information
* Course: SSW 590 – DevOps Principles and Practices
* Instructor: Dr. Gregg Vesonder
* Semester: Fall 2025

#### 📋 Project Overview
Askly is a streamlined Q&A platform designed to demonstrate practical DevSecOps concepts. Modern forums are often overloaded with distracting features - Askly focuses on what matters most: asking questions, sharing knowledge, and supporting collaborative learning.

The project combines a simple, intuitive user experience with a fully integrated DevSecOps pipeline that emphasizes automation, security, and reliability.

#### ✨ Core Features
* 📝 Ask & Answer Questions - Clean, distraction-free interface enabling students to post questions and share solutions
* 👍 Upvote / Downvote System - Crowdsourced ranking ensures the best contributions surface naturally
* 🏷️ Tag-Based Content Discovery - Organize questions using tags for faster search and topic grouping
* 🔔 Real-Time Notifications - Stay informed when your question receives new answers or votes
* 🔒 Security-First Design - Authentication, validation, and secure coding practices implemented throughout

#### Technology Stack
**Frontend**
* React + Vite

**Backend**
* Node.js + Express
* Prisma ORM with PostgreSQL
* JWT-based authentication
* Metrics exposed via /metrics

**Database**
* PostgreSQL

#### 🔐 DevSecOps Integration
Askly is not just a web app - it's a complete DevSecOps implementation showcasing how modern teams build, secure, and deploy software:

**1. Continuous Integration (CI)**
* Automated backend testing using Jest
* Database migrations applied in CI
* Pull-request-based validation
* Test coverage reports

**2. Security Scanning**
* Trivy vulnerability scanning
* Filesystem scanning
* Docker image scanning
* Gitleaks secret scanning
* CodeQL static analysis for security flaws

**3. Containerization**
* Fully containerized architecture
* Independent containers for: Frontend, Backend, PostgreSQL, Prometheus, Grafana
* Consistent environment from development to deployment

**4. Monitoring & Observability**
* Prometheus scrapes backend metrics from /metrics endpoint
* Grafana dashboards visualize system performance, traffic, and error rates
* Helps evaluate system health and bottlenecks in real-time

**5. GitHub vs. GitLab Evaluation**

As part of the course requirement, the team evaluated differences between GitHub and GitLab in:
* CI/CD pipelines
* Security tooling
* Monitoring capabilities
* Developer experience
* Integration options

This exploration helped the team understand trade-offs and choose appropriate tools for deployment.

#### 🎯 Project Goals
1. Build a functional Q&A platform with essential features
2. Integrate DevSecOps best practices across development, security, and operations
3. Evaluate GitHub and GitLab capabilities and understand their trade-offs
4. Design a secure, observable, and automated workflow from code to deployment
5. Document a full DevSecOps pipeline demonstrating CI, security, and monitoring

#### 📦 Deployment
Askly is deployed using Render, a cloud platform that provides simple, scalable hosting for full-stack applications.

#### 📈 Monitoring
* Prometheus scrapes metrics from backend
* Grafana visualizes: API request throughput, Error rates, CPU & memory patterns, Database performance

This ensures complete operational visibility, a key requirement of DevOps.

#### 🔍 Repository Structure
```
.github/workflows/     -> CI/CD pipelines (tests, scans, code analysis)
backend/               -> Express API + Prisma ORM + tests + metrics
frontend/              -> React app deployed with Nginx
docker-compose.yml     -> Local multi-container orchestration
prometheus.yml         -> Monitoring config
```

#### 📌 Summary
Askly is a demonstration of how a simple idea - a Q&A forum - can be elevated with the right DevOps and security practices. Through automation, testing, monitoring, and secure coding, the project highlights the complete lifecycle of building modern, reliable web systems.
