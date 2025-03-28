<template>
    <div class="page container">
        <h2 class="text-center">Quản lý Độc Giả</h2>

        <div class="row mt-3">
            <div class="col-md-12">
                <InputSearch v-model="searchText" />
            </div>
        </div>

        <!-- Tiêu đề danh sách và nút "Thêm mới" cùng hàng -->
        <div class="row mt-3 align-items-center justify-content-between">
            <div class="col-auto">
                <h4>Danh sách Độc Giả <i class="fas fa-users"></i></h4>
            </div>
            <div class="col-auto">
                <button class="btn btn-sm btn-success" @click="goToAddReader">
                    <i class="fas fa-plus"></i> Thêm mới
                </button>
            </div>
        </div>

        <div class="row mt-3">
            <div class="col-md-12">
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Họ Tên</th>
                            <th>Ngày Sinh</th>
                            <th>Phái</th>
                            <th>Địa Chỉ</th>
                            <th>Điện Thoại</th>
                            <th class="text-center">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(reader, index) in filteredReaders" :key="index" @click="activeIndex = index">
                            <td>{{ reader.HoLot }} {{ reader.Ten }}</td>
                            <td>{{ reader.NgaySinh }}</td>
                            <td>{{ reader.Phai }}</td>
                            <td>{{ reader.DiaChi }}</td>
                            <td>{{ reader.DienThoai }}</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-warning mr-2" @click="goToEditReader(reader._id)">
                                    <i class="fas fa-edit"></i> Sửa
                                </button>
                                <button class="btn btn-sm btn-danger" @click="removeReader(reader._id)">
                                    <i class="fas fa-trash"></i> Xóa
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="filteredReadersCount === 0">Không có độc giả nào.</p>
            </div>
        </div>

        
    </div>
</template>

<script>
import InputSearch from "@/components/InputSearch.vue";
import ReaderService from "@/services/reader.service";

export default {
    components: {
        InputSearch,
    },
    data() {
        return {
            readers: [],
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
        readerStrings() {
            return this.readers.map((reader) => {
                const { HoLot, Ten, NgaySinh, Phai, DiaChi, DienThoai } = reader;
                return [HoLot, Ten, NgaySinh, Phai, DiaChi, DienThoai].join("");
            });
        },
        filteredReaders() {
            if (!this.searchText) return this.readers;
            return this.readers.filter((_reader, index) =>
                this.readerStrings[index].includes(this.searchText)
            );
        },
        filteredReadersCount() {
            return this.filteredReaders.length;
        },
    },
    methods: {
        async retrieveReaders() {
            try {
                this.readers = await ReaderService.getAll();
            } catch (error) {
                console.log(error);
            }
        },

        refreshList() {
            this.retrieveReaders();
            this.activeIndex = -1;
        },

        async removeAllReaders() {
            if (confirm("Bạn muốn xóa tất cả độc giả?")) {
                try {
                    await ReaderService.deleteAll();
                    this.refreshList();
                } catch (error) {
                    console.log(error);
                }
            }
        },

        async removeReader(id) {
            if (confirm("Bạn có chắc chắn muốn xóa độc giả này?")) {
                try {
                    await ReaderService.delete(id);
                    this.refreshList();
                } catch (error) {
                    console.log("Lỗi khi xóa độc giả:", error);
                }
            }
        },

        goToEditReader(id) {
            this.$router.push({ name: "reader.edit", params: { id } });
        },
        goToAddReader() {
            this.$router.push({ name: "reader.add" });
        },
    },
    mounted() {
        this.refreshList();
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
