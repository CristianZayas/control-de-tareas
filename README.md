# 📝 Control de Tareas

Bienvenido al proyecto **Control de Tareas**. Esta es una aplicación diseñada para ayudar a gestionar y organizar tus actividades diarias de manera eficiente, con un enfoque en la administración de tareas y proyectos, incluyendo la gestión de usuarios y seguridad.

## 🚀 Fases del Desarrollo

A continuación, se describe cada una de las fases del desarrollo del proyecto **Control de Tareas**, desde la creación del backend hasta el diseño del frontend con Angular.

### 🛠️ Fase 1 – Backend de Cero
En esta fase se creó el backend desde cero utilizando **Node.js**, **Express** y **MongoDB**. Implementamos **CORS** para la gestión de solicitudes entre diferentes orígenes, y se configuró un sistema de **JWT** para proteger las rutas y gestionar las sesiones de los usuarios. Se utilizó **bcrypt** para el cifrado de contraseñas y **Docker** para la conexión a la base de datos.

### ⚙️ Fase 2 – Rutas de la API
Se configuraron las rutas de la API, implementando métodos **GET**, **POST**, **PUT**, y **DELETE** para permitir la gestión de datos. Estas rutas permiten realizar operaciones CRUD sobre usuarios, proyectos y tareas.

### 🔒 Fase 3 – Verificación de Token
Se implementó un sistema de verificación de tokens, que valida si el token de autenticación es válido o ha expirado. En caso de un token inválido, el sistema notifica al usuario que debe iniciar sesión nuevamente.

### 🗃️ Fase 4 – Creación de Esquemas de Base de Datos
En esta fase se crearon los esquemas de la base de datos, como los de **usuarios**, **proyectos**, **tareas**, y **un contador de intentos de refresco de token**.

### 🔐 Fase 5 – Seguridad de Login
Se añadió una lógica en el sistema de autenticación para limitar a 6 intentos fallidos de inicio de sesión. Si se supera este límite, la cuenta se bloquea por 2 horas, aumentando la seguridad del sistema.

### 🎨 Fase 6 – Creación de la App en Angular
Se desarrolló el frontend con **Angular**, creando una aplicación para la gestión de tareas, proyectos y usuarios, y haciendo uso de **Bootstrap** y **CSS** para el diseño de la interfaz.

### 💻 Fase 7 – Diseño de la Interfaz
Para el diseño de la interfaz, se utilizó **Bootstrap** y **CSS puro**, junto con **FontAwesome** para los íconos. La aplicación es completamente responsive, brindando una experiencia amigable tanto en dispositivos de escritorio como móviles.

### 🔄 Fase 8 – Consumo de APIs
Se configuró el consumo de las APIs del backend para obtener y enviar datos relacionados con las tareas, proyectos y usuarios. Se implementó un servicio dedicado para manejar la comunicación con el backend de manera eficiente.

### 🧑‍💻 Fase 9 – Creación de Componentes Principales
Se desarrollaron componentes clave como **Login**, **Home**, **SignUp**, y **Reset Password**. Estos componentes permiten gestionar el acceso del usuario a la aplicación y la interacción básica con el sistema.

### 🛡️ Fase 10 – Implementación de Pipes, Interceptores y Guards
Se implementaron pipes personalizados, interceptores para manejar solicitudes HTTP, guards para proteger las rutas y interfaces para mantener la estructura y organización del código. Además, se añadió la lógica en los guards para verificar el rol del usuario y permitir o bloquear el acceso a ciertas rutas dependiendo de los permisos.

### 📊 Fase 11 – Servicios de Consumo de APIs
Se crearon servicios para cada esquema de la base de datos (usuarios, proyectos, tareas, etc.), con el fin de mantener el código bien organizado y facilitar el consumo de las APIs usando **RxJS** y el **cookie-service** para manejar las cookies de autenticación.

### 🔄 Fase 12 – Creación de Componentes de Funcionalidad
En esta fase se crearon componentes esenciales como **Creación de Tareas**, **Visualización de Tareas**, **Actualización de Tareas**, **Creación de Proyectos**, **Visualización de Proyectos**, **Perfil de Usuario** y **Actualización de Perfil**. Además, se incluyeron componentes adicionales como **Footer**, **Navbar** y **Página 404**, para mejorar la experiencia del usuario y la navegabilidad dentro de la aplicación.

---

## 👨‍💻 Contribuciones

Este proyecto está abierto a contribuciones. Si tienes alguna sugerencia o mejora que quieras implementar, no dudes en realizar un **pull request**. 

¡Gracias por tu interés en este proyecto!
