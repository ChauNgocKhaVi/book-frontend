<template>
    <div class="page container">
        <h2 class="text-center">Quản lý Mượn Sách</h2>
        
        <div class="row mt-3">
            <div class="col-md-12">
                <InputSearch v-model="searchText" />
            </div>
        </div>
    
        <!-- Tiêu đề và nút Thêm mới cùng hàng -->
        <div class="row mt-3 d-flex justify-content-between align-items-center">
            <div class="col">
                <h4>Danh sách Sách <i class="fas fa-book"></i></h4>
            </div>
            <div class="col-auto">
                <button class="btn btn-sm btn-success" @click="goToAddBook">
                    <i class="fas fa-plus"></i> Thêm mới
                </button>
            </div>
        </div>
    
        <div class="row mt-3">
            <div class="col-md-12">
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Tên Sách</th>
                            <th>Đơn Giá</th>
                            <th>Số Quyển</th>
                            <th>Năm Xuất Bản</th>
                            <th>Nhà NXB</th>
                            <th>Tác Giả</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(book, index) in filteredBooks" :key="index" @click="activeIndex = index">
                            <td>{{ book.TenSach }}</td>
                            <td>{{ book.DonGia }}</td>
                            <td>{{ book.SoQuyen }}</td>
                            <td>{{ book.NamXuatBan }}</td>
                            <td>{{ book.TenNXB }}</td>
                            <td>{{ book.TacGia }}</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-warning mr-2" @click="goToEditBook(book._id)">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" @click="removeBook(book._id)">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="filteredBooksCount === 0">Không có sách nào.</p>
            </div>
        </div>
    </div>
</template>

<script>
import InputSearch from "@/components/InputSearch.vue";
import BookService from "@/services/book.service";
import PublisherService from "@/services/publisher.service";

export default {
    components: {
        InputSearch,
    },
    data() {
        return {
            books: [],
            publishers: [],
            activeIndex: -1,
            searchText: "",
        };
    },
    watch: {
        searchText() {
            this.activeIndex = -1;
        },
    },
    computed: {
        filteredBooks() {
            if (!this.searchText) {
                return this.books.map(book => ({
                    ...book,
                    TenNXB: this.getPublisherName(book.MaNXB),
                }));
            }
            return this.books
                .map(book => ({
                    ...book,
                    TenNXB: this.getPublisherName(book.MaNXB),
                }))
                .filter((book) => {
                    const bookString = `${book.TenSach} ${book.DonGia} ${book.SoQuyen} ${book.NamXuatBan} ${book.TenNXB} ${book.TacGia}`;
                    return bookString.toLowerCase().includes(this.searchText.toLowerCase());
                });
        },
        filteredBooksCount() {
            return this.filteredBooks.length;
        },
    },
    methods: {
        async retrieveBooks() {
            try {
                this.books = await BookService.getAll();
            } catch (error) {
                console.log(error);
            }
        },
        async retrievePublishers() {
            try {
                this.publishers = await PublisherService.getAll();
            } catch (error) {
                console.error("Lỗi khi tải danh sách Nhà Xuất Bản:", error);
            }
        },
        getPublisherName(maNXB) {
            const publisher = this.publishers.find(p => p._id === maNXB);
            return publisher ? publisher.TenNXB : "Không xác định";
        },
        refreshList() {
            this.retrieveBooks();
            this.activeIndex = -1;
        },
        async removeBook(bookId) {
            if (confirm("Bạn muốn xóa sách này?")) {
                try {
                    await BookService.delete(bookId);
                    this.books = this.books.filter(book => book._id !== bookId);
                    this.refreshList();
                } catch (error) {
                    console.error("Lỗi khi xóa sách:", error);
                }
            }
        },
        goToEditBook(id) {
            this.$router.push({ name: "book.edit", params: { id } });
        },
        goToAddBook() {
            this.$router.push({ name: "book.add" });
        },
    },
    mounted() {
        this.retrieveBooks();
        this.refreshList();
        this.retrievePublishers();
        // Kiểm tra nếu có query reload thì load lại danh sách
        if (this.$route.query.reload) {
            this.retrieveBooks();
        }
    },
};
</script>

<style scoped>
.page {
    text-align: left;
    max-width: 1000px;
    margin: auto;
}
</style>
