<template>
    <nav class="navbar navbar-expand navbar-dark bg-dark">
        <a href="/" class="navbar-brand">Quản lý mượn sách</a>
        <div class="mr-auto navbar-nav" v-if="user">
            <li class="nav-item">
                <router-link :to="{ name: 'book' }" class="nav-link">
                    Sách <i class="fas fa-book"></i>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'publisher' }" class="nav-link">
                    Nhà xuất bản <i class="fas fa-building"></i>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'reader' }" class="nav-link">
                    Độc giả <i class="fas fa-users"></i>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'borrow' }" class="nav-link">
                    Mượn sách <i class="fas fa-book-reader"></i>
                </router-link>
            </li>
        </div>

        <div class="navbar-nav ml-auto">
            <li v-if="user" class="nav-item d-flex align-items-center">
                <!-- <span class="navbar-text text-light me-3 mr-4">
                    Xin chào, {{ user.username }}
                </span> -->
                <button class="btn btn-danger btn-sm" @click="logout">
                    Đăng xuất <i class="fas fa-sign-out-alt"></i>
                </button>
            </li>
            <li v-if="!user" class="nav-item">
                <router-link :to="{ name: 'login' }" class="nav-link">
                    Đăng nhập <i class="fas fa-sign-in-alt"></i>
                </router-link>
            </li>
            <li v-if="!user" class="nav-item">
                <router-link :to="{ name: 'register' }" class="nav-link">
                    Đăng ký <i class="fas fa-user-plus"></i>
                </router-link>
            </li>
        </div>
    </nav>
</template>

<script>
import AuthService from "@/services/auth.service";
import { computed, watchEffect } from "vue";
import { useRouter } from "vue-router";

export default {
    setup() {
        const router = useRouter();
        const user = computed(() => AuthService.state.user); // Theo dõi trạng thái user

        // Kiểm tra user có dữ liệu không
        watchEffect(() => {
            console.log("User từ AuthService:", user.value);
        });

        const logout = () => {
            AuthService.logout();
            router.push("/login");
        };

        return { user, logout };
    }
};
</script>


<style scoped>
.navbar {
    padding: 10px;
}
.navbar-nav {
    display: flex;
    align-items: center;
}
.nav-link {
    margin-right: 15px;
}
.navbar-text {
    font-size: 1rem;
    font-weight: bold;
}
button {
    border: none;
    cursor: pointer;
}
</style>
