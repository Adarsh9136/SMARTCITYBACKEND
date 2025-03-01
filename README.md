# Smart City Backend

## Project Overview
This project is the backend of a Smart City application where users can:
- Create accounts
- Request shops and services
- Post needs and ratings
- Manage various functionalities through APIs

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/Adarsh9136/SMARTCITYBACKEND.git
   ```
2. Navigate to the project folder:
   ```sh
   cd smartcity-backend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file in the root directory and add required environment variables.
5. Start the server:
   ```sh
   npm start
   ```

## API Endpoints

### Authentication
- **Signup:** `POST /auth/signup`
- **Login:** `POST /auth/login`
- **Logout:** `POST /auth/logout`

### Categories
- **Add Category:** `POST /categories/`
- **Update Category:** `PUT /categories/`
- **Approve Category:** `PUT /categories/approve`
- **Get Categories:** `GET /categories/`

### OTP
- **Generate OTP:** `POST /otp/generate`
- **Validate OTP:** `POST /otp/validate`

### Products
- **Add Product:** `POST /products/product`
- **Get All Products:** `GET /products/products`
- **Get Product by ID:** `GET /products/product/:id`
- **Get Product by Category:** `GET /products/category/:categoryId`
- **Get Product by Shop:** `GET /products/shop/:shopId`
- **Update Product:** `PUT /products/product/:id`
- **Search Products:** `GET /products/search`
- **Filter Products:** `GET /products/filter`

### Shops
- **Add Shop:** `POST /shops/add`
- **Update Shop:** `PUT /shops/update`
- **Approve Shop:** `PUT /shops/approve`
- **Get Shop by ID:** `GET /shops/id/:shopId`
- **Get My Shops:** `GET /shops/user`
- **Get All Shops:** `GET /shops/all`
- **Get Shops by Categories:** `GET /shops/by-categories`
- **Search Shops:** `GET /shops/search`
- **Search Shops Query:** `GET /shops/searchquery`

### Users
- **Get User Profile:** `GET /users/profile`
- **Update User Profile:** `PUT /users/profile`
- **Add to Favourites:** `PUT /users/favourites/add`
- **Remove from Favourites:** `PUT /users/favourites/remove`
- **Add User Role:** `PATCH /users/add-role`

### Needs
- **Add Need:** `POST /needs/`
- **Edit Need:** `PUT /needs/:needId`
- **Change Need Status:** `PUT /needs/status/:needId`
- **Delete Need:** `DELETE /needs/:needId`
- **Get My Needs:** `GET /needs/my-needs`
- **Get Needs by Shop ID:** `GET /needs/shop`

### Reviews
- **Add Review:** `POST /reviews/`
- **Edit Review:** `PUT /reviews/:reviewId`
- **Delete Review:** `DELETE /reviews/:reviewId`
- **Get Product Reviews:** `GET /reviews/:productId`

### Requests
- **Create Request:** `POST /requests/`
- **Update Request Status:** `PUT /requests/status`
- **Edit Request:** `PUT /requests/edit`
- **Delete Request:** `DELETE /requests/:requestId`
- **Get User Requests:** `GET /requests/my-request`
- **Get Requests by Category IDs:** `GET /requests/categories`
- **Get All Requests:** `GET /requests/all`

### Services
- **Add Service:** `POST /services/`
- **Edit Service:** `PUT /services/:serviceId`
- **Change Service Status:** `PUT /services/status/:serviceId`
- **Delete Service:** `DELETE /services/:serviceId`
- **Get My Services:** `GET /services/my-services`
- **Get Services by Role:** `GET /services/role/:roleId`

### Service Roles
- **Add Service Role:** `POST /service-roles/`
- **Get All Service Roles:** `GET /service-roles/`
- **Get Service Role by ID:** `GET /service-roles/:roleId`
- **Edit Service Role:** `PUT /service-roles/:roleId`
- **Delete Service Role:** `DELETE /service-roles/:roleId`

### Service Users
- **Add Service User:** `POST /service-users/`
- **Get All Service Users:** `GET /service-users/`
- **Get Service Users by Role ID:** `GET /service-users/role/:roleId`
- **Approve Service User:** `PUT /service-users/approve`

### Service Reviews
- **Add Service Review:** `POST /service-reviews/`
- **Get All Reviews:** `GET /service-reviews/`
- **Get Reviews for Service User:** `GET /service-reviews/user/:serviceUserId`
- **Get Reviews for Service:** `GET /service-reviews/service/:serviceId`
- **Delete Review:** `DELETE /service-reviews/:reviewId`
- **Edit Review:** `PUT /service-reviews/:reviewId`
- **Get Reviews by Role ID:** `GET /service-reviews/role/:roleId`

## Contribution Guidelines
- Fork the repository
- Create a new branch (`git checkout -b feature-name`)
- Commit your changes (`git commit -m "Added new feature"`)
- Push to your branch (`git push origin feature-name`)
- Open a Pull Request

## License
This project is licensed under the MIT License.

## Developed By
Adarsh Kashyap
