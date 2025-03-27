import { createRouter, createWebHistory } from "vue-router";
import Book from '@/views/Book.vue';
import Publisher from '@/views/Publisher.vue';
import Reader from '@/views/Reader.vue';
import Borrow from '@/views/Borrow.vue';

import StaffLogin from "@/views/StaffLogin.vue";
import StaffRegister from "@/views/StaffRegister.vue";
import NotFound from "@/views/NotFound.vue";
import AuthService from "@/services/auth.service"; // Import AuthService

const routes = [
    { path: "/", redirect: "/books" },

    // Sách
    { path: "/books", name: "book", component: Book, meta: { requiresAuth: true } },
    { path: "/books/:id", name: "book.edit", component: () => import("@/views/BookEdit.vue"), props: true, meta: { requiresAuth: true } },
    { path: "/books/add", name: "book.add", component: () => import("@/views/BookAdd.vue"), meta: { requiresAuth: true } },

    // Nhà xuất bản
    { path: "/publishers", name: "publisher", component: Publisher, meta: { requiresAuth: true } },
    { path: "/publishers/:id", name: "publisher.edit", component: () => import("@/views/PublisherEdit.vue"), props: true, meta: { requiresAuth: true } },
    { path: "/publishers/add", name: "publisher.add", component: () => import("@/views/PublisherAdd.vue"), meta: { requiresAuth: true } },

    // Độc giả
    { path: "/readers", name: "reader", component: Reader, meta: { requiresAuth: true } },
    { path: "/readers/:id", name: "reader.edit", component: () => import("@/views/ReaderEdit.vue"), props: true, meta: { requiresAuth: true } },
    { path: "/readers/add", name: "reader.add", component: () => import("@/views/ReaderAdd.vue"), meta: { requiresAuth: true } },

    // Mượn sách
    { path: "/borrows", name: "borrow", component: Borrow, meta: { requiresAuth: true } },
    { path: "/borrows/:id", name: "borrow.edit", component: () => import("@/views/BorrowEdit.vue"), props: true, meta: { requiresAuth: true } },
    { path: "/borrows/add", name: "borrow.add", component: () => import("@/views/BorrowAdd.vue"), meta: { requiresAuth: true } },

    // Đăng nhập / Đăng ký nhân viên
    { path: "/login", name: "login", component: StaffLogin },
    { path: "/register", name: "register", component: StaffRegister },

    // Route xử lý lỗi 404
    { path: "/:pathMatch(.*)*", name: "notfound", component: NotFound },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 🔒 Middleware kiểm tra đăng nhập trước khi vào các trang yêu cầu xác thực
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const user = AuthService.getCurrentUser(); // Lấy thông tin user từ localStorage

    if (requiresAuth && !user) {
        next("/login"); // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
    } else {
        next(); // Tiếp tục nếu đã đăng nhập
    }
});

export default router;
