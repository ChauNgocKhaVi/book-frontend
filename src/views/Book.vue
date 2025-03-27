<template>
    <div class="page container">
        <h2 class="text-center">Quản lý Mượn Sách</h2>
        
        <div class="row mt-3">
            <div class="col-md-12">
                <InputSearch v-model="searchText" />
            </div>
        </div>
    

        <div class="row mt-3">
            <div class="col-md-12">
                <h4>Danh sách Sách <i class="fas fa-book"></i></h4>
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
                                <!-- Nút Sửa -->
                                <button class="btn btn-sm btn-warning mr-2" @click="goToEditBook(book._id)">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <!-- Nút Xóa -->
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
        
        <div class="row mt-3">
            <div class="col-md-12 text-center">
                
                <button class="btn btn-sm btn-success m-5" @click="goToAddBook">
                    <i class="fas fa-plus"></i> Thêm mới
                </button>
                <button class="btn btn-sm btn-danger" @click="removeAllBooks">
                    <i class="fas fa-trash"></i> Xóa tất cả
                </button>
            </div>
        </div>
    
    </div>
</template>

<script>
import BookCard from "@/components/BookCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import BookService from "@/services/book.service";
import PublisherService from "@/services/publisher.service";


export default {
    components: {
        BookCard,
        InputSearch,
    },
    data() {
        return {
            books: [],
            publishers: [], // Danh sách Nhà Xuất Bản
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
        bookStrings() {
            return this.books.map((book) => {
                const publisher = this.publishers.find(p => p._id === book.MaNXB);
                const tenNXB = publisher ? publisher.TenNXB : "Không xác định";
                return {
                    TenSach: book.TenSach,
                    DonGia: book.DonGia,
                    SoQuyen: book.SoQuyen,
                    NamXuatBan: book.NamXuatBan,
                    TenNXB: tenNXB,
                    TacGia: book.TacGia,
                };
            });
        },
     

        filteredBooks() {
            if (!this.searchText) {
                return this.books.map(book => ({
                    ...book,
                    TenNXB: this.getPublisherName(book.MaNXB), // Gán Tên NXB vào từng sách
                }));
            }
            
            return this.books
                .map(book => ({
                    ...book,
                    TenNXB: this.getPublisherName(book.MaNXB),
                }))
                .filter((book) => {
                    // Lọc theo các thông tin trong bookStrings
                    const bookString = `${book.TenSach} ${book.DonGia} ${book.SoQuyen} ${book.NamXuatBan} ${book.TenNXB} ${book.TacGia}`;
                    return bookString.toLowerCase().includes(this.searchText.toLowerCase());
                });
        },

        activeBook() {
            if (this.activeIndex < 0) return null;
            return this.filteredBooks[this.activeIndex];
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

        // Hàm Lấy nhà xuất bản
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

        async removeAllBooks() {
            if (confirm("Bạn muốn xóa tất cả sách?")) {
                try {
                    await BookService.deleteAll();
                    this.refreshList();
                } catch (error) {
                    console.log(error);
                }
            }
        },

        async removeBook(bookId) {
            if (confirm("Bạn muốn xóa sách này?")) {
                try {
                    await BookService.delete(bookId);  // Gọi API để xóa sách
                    this.books = this.books.filter(book => book._id !== bookId); // Xóa sách khỏi mảng
                    this.refreshList(); // Làm mới danh sách
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
        this.refreshList();
        this.retrievePublishers(); // Gọi API để lấy danh sách NXB
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