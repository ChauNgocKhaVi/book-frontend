<template>
    <div class="page container">
        <h2 class="text-center">Quản lý mượn sách</h2>        
        <div class="row mt-3">
            <div class="col-md-12">
                <InputSearch v-model="searchText" />
            </div>
        </div>
        
        <div class="row mt-3">
            <div class="col-md-12">
                <h4>Danh sách nhà xuất bản <i class="fas fa-building"></i></h4>
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Tên nhà xuất bản</th>
                            <th>Địa chỉ</th>                
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(publisher, index) in filteredPublishers" :key="index" @click="activeIndex = index">
                            <td>{{ publisher.TenNXB }}</td>
                            <td>{{ publisher.DiaChi }}</td>                            
                            <td class="text-center">
                                <!-- Nút Sửa -->
                                <button class="btn btn-sm btn-warning mr-4" @click="goToEditStaff(publisher._id)">
                                    <i class="fas fa-edit"></i> Sửa
                                </button>
                                <!-- Nút Xóa -->
                                <button class="btn btn-sm btn-danger ml-2" @click="removePublisher(publisher._id)">
                                    <i class="fas fa-trash"></i> Xóa
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="filteredPublishersCount === 0">Không có nhà xuất bản nào.</p>
            </div>
        </div>
        
        <div class="row mt-3">
            <div class="col-md-12 text-center">
                <button class="btn btn-sm btn-success mr-5" @click="goToAddPublisher">
                    <i class="fas fa-plus"></i> Thêm mới
                </button>
                <button class="btn btn-sm btn-danger" @click="removeAllPublishers">
                    <i class="fas fa-trash"></i> Xóa tất cả
                </button>
            </div>
        </div>
        
    </div>
</template>

<script>
import PublisherCard from "@/components/PublisherCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import PublisherService from "@/services/publisher.service";
export default {
    components: {
        PublisherCard,
        InputSearch,
    },
    data() {
        return {
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
        publisherStrings() {
            return this.publishers.map((publisher) => {
                const { TenNXB, DiaChi } = publisher;
                return [TenNXB, DiaChi].join("");
            });
        },
        filteredPublishers() {
            if (!this.searchText) return this.publishers;
            return this.publishers.filter((_publisher, index) =>
                this.publisherStrings[index].includes(this.searchText)
            );
        },
        
        filteredPublishersCount() {
            return this.filteredPublishers.length;
        },
    },
    methods: {
        async retrievePublishers() {
            try {
                this.publishers = await PublisherService.getAll();
            } catch (error) {
                console.log(error);
            }
        },

        refreshList() {
            this.retrievePublishers();
            this.activeIndex = -1;
        },

        async removeAllPublishers() {
            if (confirm("Bạn muốn xóa tất cả nhà xuẩ bản không?")) {
                try {
                    await PublisherService.deleteAll();
                    this.refreshList();
                } catch (error) {
                    console.log(error);
                }
            }
        },

        async removePublisher(publisherId) {
            if (confirm("Bạn muốn xóa nhà xuất bản này?")) {
                try {
                    await PublisherService.delete(publisherId);  // Gọi API để xóa nhà xuất bản
                    this.refreshList();  // Làm mới danh sách
                } catch (error) {
                    console.error("Lỗi khi xóa nhà xuất bản:", error);
                }
            }
        },

        goToEditStaff(id) {
            this.$router.push({ name: "publisher.edit", params: { id } });
        },
        goToAddPublisher() {
            this.$router.push({ name: "publisher.add" });
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