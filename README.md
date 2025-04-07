# Product Front

Este proyecto es una aplicación frontend desarrollada con Angular que interactúa con una API backend para mostrar, añadir al carrito y gestionar productos.

## Descripción

Product Front proporciona una interfaz de usuario para:

*   Visualizar una lista paginada de productos.
*   Buscar productos por nombre.
*   Añadir productos a un carrito de compras.
*   Ver el contenido del carrito.
*   (Opcional: Añadir/Editar/Eliminar productos - si aplica).

El proyecto utiliza Angular y Tailwind CSS para la interfaz de usuario. Se comunica con **dos microservicios backend distintos** a través de una API REST para obtener y manipular los datos:

1.  **Microservicio de Productos:** Gestiona la información de los productos (listado, búsqueda, stock, etc.).
2.  **Microservicio de Compras:** Gestiona el proceso de compra y el carrito.

Cada microservicio requiere una **API Key independiente** para la autenticación de las solicitudes.

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

*   Node.js (se recomienda la versión LTS)
*   npm (generalmente viene con Node.js)
*   Angular CLI: `npm install -g @angular/cli`

## Instalación

1.  Clona el repositorio:
    ```bash
    git clone <url-del-repositorio>
    cd product-front
    ```
2.  Instala las dependencias del proyecto:
    ```bash
    npm install
    ```

## Ejecutar el Servidor de Desarrollo

Ejecuta `ng serve` para iniciar el servidor de desarrollo. Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias alguno de los archivos fuente.

```bash
ng serve -o
```

El flag `-o` abre automáticamente el navegador en la dirección especificada.

## Ejecutar Pruebas Unitarias

Ejecuta `ng test` para ejecutar las pruebas unitarias a través de [Karma](https://karma-runner.github.io).

```bash
ng test
```

Para ejecutar las pruebas con cobertura de código:

```bash
ng test --code-coverage
```

## Generación de Componentes (Code Scaffolding)

Ejecuta `ng generate component nombre-componente` para generar un nuevo componente. También puedes usar `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Ayuda Adicional

Para obtener más ayuda sobre Angular CLI, usa `ng help` o consulta la [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Configuración del Entorno

Asegúrate de configurar correctamente las variables de entorno en `src/environments/environment.ts` (y `src/environments/environment.prod.ts` para producción), especialmente la URL de la API backend (`apiUrl`) y las API Keys correspondientes para cada microservicio.

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api', // URL base o del gateway
  // Ejemplo de cómo podrían almacenarse las keys (ajustar según tu implementación)
  productServiceApiKey: 'TU_API_KEY_PRODUCTOS',
  purchaseServiceApiKey: 'TU_API_KEY_COMPRAS'
};
```
