```markdown
# 🎨 Gaafisto Angular Frontend

Modern e-commerce frontend built with Angular 17.

## 🚀 Quick Start

```bash
npm install
ng serve
```

Navigate to `http://localhost:4200`

## 📁 Project Structure

```
src/
├── app/
│   ├── core/                 # Core functionality
│   │   ├── guards/          # Route guards
│   │   ├── interceptors/    # HTTP interceptors
│   │   ├── services/        # Core services
│   │   └── models/          # Data models
│   ├── shared/              # Shared resources
│   │   ├── components/      # Reusable components
│   │   ├── directives/      # Custom directives
│   │   └── pipes/           # Custom pipes
│   ├── features/            # Feature modules
│   │   ├── auth/           # Authentication
│   │   ├── public/         # Public pages
│   │   ├── user/           # User dashboard
│   │   └── admin/          # Admin panel
│   └── app.routes.ts       # Application routes
├── assets/                  # Static assets
├── environments/            # Environment configs
└── styles.scss             # Global styles
```

## 🎯 Available Scripts

```bash
ng serve              # Development server
ng build              # Production build
ng test               # Run tests
ng lint               # Lint code
ng generate component # Generate component
```

## 🔧 Configuration

### Environment Files

- `environment.ts` - Development config
- `environment.prod.ts` - Production config

### Angular Configuration

See `angular.json` for build configurations.

## 📦 Dependencies

### Main Dependencies
- `@angular/core` - Angular framework
- `@angular/router` - Routing
- `@angular/forms` - Form handling
- `bootstrap` - UI framework
- `ngx-toastr` - Notifications

### Dev Dependencies
- `@angular/cli` - CLI tools
- `typescript` - TypeScript compiler

## 🎨 Styling

- **Framework**: Bootstrap 5
- **Preprocessor**: SCSS
- **Icons**: Font Awesome

## 🔐 Authentication

JWT-based authentication with route guards:
- `AuthGuard` - Protects authenticated routes
- `RoleGuard` - Role-based access control

## 🧩 Features

- Lazy loading modules
- Standalone components
- Reactive forms
- HTTP interceptors
- Error handling
- Loading states

## 📱 Responsive Design

Optimized for:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🛠️ Development

### Generate Components
```bash
ng g c features/public/home
```

### Generate Services
```bash
ng g s core/services/auth
```

### Generate Guards
```bash
ng g g core/guards/auth
```

## 📚 Documentation

- [Angular Documentation](https://angular.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

Made with Angular 17 ❤️
```

---