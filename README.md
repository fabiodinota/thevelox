# ✨ The Velox: The Next Generation Transit Solution

The Velox is a revolutionary full-stack transit application designed for seamless route planning, live map visualization, and instant ticket purchasing. Built from the ground up to showcase advanced engineering, interactive design, and a fully custom user experience, Velox represents a comprehensive, end-to-end solo development effort.

-----

## 🚀 Features

The Velox delivers a powerful, intuitive experience with a focus on speed and efficiency:

  * **Intelligent Pathfinding:** Instantly calculates the optimal, shortest route between any two points on the network.
  * **Real-time Route Visualization:** Interactive, custom-loaded maps display routes, stations, and pathfinding results dynamically.
  * **Secure Authentication:** Robust user authentication and session management built using JWT and encrypted tokens.
  * **Admin Dashboard:** Dedicated administrative interface for managing users and system data.
  * **Integrated Payment System:** Seamlessly purchase tickets using various payment methods, with functionality to add and manage payment details securely.
  * **Responsive Design:** A modern, mobile-first interface built with Next.js and Tailwind CSS for a fluid experience on any device.

-----

## 🧠 Technical Deep Dive: The Core Engine

The core functionality of Velox relies on a highly specialized, custom-built routing and mapping system.

### **Pathfinding Algorithm: Dijkstra's Shortest Path**

The route calculation is powered by an optimized implementation of **Dijkstra's Shortest Path Algorithm**. This classic graph algorithm is ideal for transit systems as it efficiently finds the lowest-cost path (where "cost" can represent distance, time, or a combination of both) from a starting station to all reachable stations.

  * **Efficiency:** The algorithm leverages a **priority queue** to ensure routes are calculated quickly, even across a large and complex transport network.
  * **Weighted Edges:** Connections between stations are treated as weighted edges, allowing the system to factor in real-world variables like travel time and transfer penalties when determining the "best" route.

### **Custom Node Graph System**

The entire transit network is represented in a custom-built **Node Graph** data structure.

  * **Custom Graph Implementation:** I designed and implemented the entire graph structure, utilizing an efficient **adjacency list** representation to model stations (nodes) and routes (edges).
  * **Scalable Routing Data:** This bespoke system allows for precise control over how route data is stored and traversed, making it adaptable to new lines, temporary closures, and varying route complexities.

### **Proprietary Map & SVG Loader**

The visual and functional heart of the application is the map rendering system.

  * **Custom SVG Loader:** I developed a specialized **SVG Map Loader** that takes custom-designed map vector graphics (SVG files) and transforms them into an interactive digital map.
  * **Data Integration:** This loader not only renders the map visually but also correlates specific SVG elements (like station icons and track paths) with the corresponding data points in the backend's Node Graph. This linkage is crucial for drawing the calculated pathfinding results directly onto the interactive map.

-----

## ✨ The Solo Vision: A True End-to-End Creation

Velox is a passion project where I personally handled **every single aspect** of development and production. It serves as a testament to full-stack, end-to-end capability.

From concept to deployment, I was the sole creator:

| Aspect | Contribution |
| :--- | :--- |
| **Video Production** | Conceptualized, scripted, filmed, and edited the promotional video content. |
| **Graphics & UI/UX** | Designed all user interface elements, application graphics, and the overall user experience. |
| **3D Visuals** | Created all custom **3D visual assets** used for branding and in the application interface. |
| **Branding** | Developed the entire project identity, including the name, logo, color palette, and brand voice. |
| **Frontend Development** | Built the entire Next.js/React frontend with TypeScript and Tailwind CSS. |
| **Backend Development** | Architected the Node.js/Express/Prisma backend, including the REST API, database schema, and routing logic. |
| **Mapping & Routing** | Designed the **custom map data structure** and implemented the core **pathfinding algorithms**. |

-----

## 🗺️ Custom Maps and Visual Assets (Placeholder)

The custom-designed transit maps and various branded assets are integral to the Velox experience.

### **Map Assets**

Upload your custom SVG/map design files here. These are the basis for the application's interactive map.

> **[PLACEHOLDER FOR CUSTOM MAP DESIGN FILES (e.g., `map.svg`, `stations.json`)]**
<img width="2491" height="678" alt="Screenshot 2025-11-23 at 18 43 41" src="https://github.com/user-attachments/assets/52432ce1-1bb5-4938-968e-4084b39aed20" />
<img width="5106" height="3077" alt="Frame 178" src="https://github.com/user-attachments/assets/66071cda-1c34-41cb-b7cd-b93bb968b4be" />

### **Visuals**

Upload 3D renders, promotional images, and branding assets here.

> **[PLACEHOLDER FOR BRANDING, GRAPHICS, AND 3D VISUALS]**


![reclame_affiche_fase3](https://github.com/user-attachments/assets/81eef8c2-e260-4a77-93ac-7d9e739a21c2)

<img width="1811" height="1283" alt="Screenshot 2025-11-23 at 18 49 48" src="https://github.com/user-attachments/assets/c86bf40b-0ab9-4cf0-bafd-0f88e42d4849" />
<img width="266" height="108" alt="Screenshot 2025-11-23 at 18 50 17" src="https://github.com/user-attachments/assets/71ec8a31-226e-4454-992c-0cae679445f6" />

<img width="1920" height="1080" alt="conceptschets_fabiodinota" src="https://github.com/user-attachments/assets/9cb8bbee-5375-4c3c-8458-2a91f9d09228" />

https://github.com/user-attachments/assets/99b32054-7bd1-4e05-ad77-fd38922d3044

https://github.com/user-attachments/assets/ad88aab2-6a92-45e5-9f98-6d9ac9d3040c

https://github.com/user-attachments/assets/b5758c31-b546-45e1-ab3f-ad6149ca7ad8

-----

## ⚙️ Setup and Installation

This project is split into two main components: `frontend` (Next.js) and `backend` (Node.js/Express/Prisma).

### **Prerequisites**

  * Node.js (v18+)
  * npm or yarn
  * A running PostgreSQL database instance (or modify the `prisma/schema.prisma` file).

### **Backend Setup**

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or yarn install
    ```
3.  Set up your environment variables (e.g., `.env` file) for database connection, JWT secrets, etc.
4.  Push the database schema and generate the client:
    ```bash
    npx prisma migrate dev --name init
    npx prisma generate
    ```
5.  Start the backend server:
    ```bash
    npm run dev
    ```

### **Frontend Setup**

1.  Navigate to the `frontend` directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or yarn install
    ```
3.  Set up your environment variables (e.g., `.env.local`) pointing to the backend API.
4.  Start the Next.js development server:
    ```bash
    npm run dev
    ```

The application should now be accessible at `http://localhost:3000`.

-----

## 🔮 Future Enhancements

  * **Real-time Data Integration:** Integrate external APIs for live train/bus tracking.
  * **Multi-Modal Routing:** Expand the pathfinding logic to incorporate walking, biking, and different transit types.
  * **User Profiles:** Advanced user customization and notification settings.
