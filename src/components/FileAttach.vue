<script lang="ts" setup>
import { ref, computed } from "vue";
import { useGlobal } from "@/composables/useGlobal";
import { DocumentFileService } from "@/services/others/documentfile.service";
import { IFileConfig } from "@/models/basic";
import { notify } from "@kyvg/vue3-notification";
import { useI18n } from "vue-i18n";
import { PaperclipIcon } from "vue-tabler-icons";

const { forceFileDownload } = useGlobal();
interface IProps {
  files: any[];
  tableId: number;
  isView?: boolean;
  columnName: string;
  size?: string;
  config: IFileConfig;
}
const props = defineProps<IProps>();
const getFiles = ref<any[]>([]);
const loading = ref();
getFiles.value = JSON.parse(JSON.stringify(props.files));
const { t } = useI18n();

const emits = defineEmits<{
  (e: "setFile", value: any): void;
  (e: "deleteFile", columnName: string): void;
}>();

const fileRef = ref<HTMLInputElement | null>(null);

const updateFile = (event: Event) => {
  if (checkFileSize(event)) {
    if (fileRef.value) {
      fileRef.value.value = "";
    }
    return;
  }

  loading.value = true;
  const formData = new FormData();
  const file = (event.target as HTMLInputElement).files || [];
  formData.append("files", file[0]);
  previewFiles(formData);
};

const previewFiles = async (formData: FormData) => {
  await DocumentFileService.UploadFile(props.tableId, formData)
    .then((res: any) => {
      getFiles.value.push({
        id: res.data[0].fileId,
        fileName: res.data[0].fileName,
        columnName: props.columnName,
        fileConfigId: props.config.id
      });
      emits("setFile", getFiles.value);
    })
    .finally(() => {
      loading.value = false;
    });
};

const deleteFile = () => {
  getFiles.value = [];
  if (fileRef.value) {
    fileRef.value.value = "";
  }
  emits("deleteFile", props.columnName);
};

const downLoadFile = (file: any) => {
  if (file) {
    DocumentFileService.DownloadFile(file.id, props.tableId).then((res: any) => {
      forceFileDownload(res, file.fileName);
    });
  }
};

const checkFileSize = (event: Event) => {
  const limitedSize = (event.target as HTMLInputElement).size;
  const files = (event.target as HTMLInputElement).files;

  if (files && limitedSize) {
    if (files[0].size > limitedSize) {
      notify({
        text: t("brokenLimitedSize", {
          size: (limitedSize / 1024 / 1024).toFixed(2)
        }),
        type: "warn"
      });

      if (fileRef.value) {
        fileRef.value.value = "";
      }
      return;
    }
  }
  return false;
};

const isViewUploadBtn = computed(() => {
  if (props.isView) {
    return false;
  } else {
    if (getFiles.value.filter((el) => el.columnName === props.columnName).length > 0) {
      return false;
    } else {
      return true;
    }
  }
});

const extension = computed(() => {
  let t: string = "";
  if (props.config) {
    t = props.config.tables.map((el) => el.extension).join(",");
  }
  return t;
});
</script>
<template>
  <div>
    <v-row class="px-2">
      <v-col v-if="config">
        <v-btn color="success" :size="size" class="mr-3" v-if="isViewUploadBtn">
          <label :for="columnName" class="d-flex">
            <PaperclipIcon class="mr-2" size="15" />
            <span>
              <slot></slot>
              <span style="color: red">*</span>
            </span>
            <input :accept="extension" type="file" :size="config.maxSize" style="display: none" :id="columnName" ref="fileRef" @change="updateFile" />
          </label>
        </v-btn>
        <v-chip
          v-if="getFiles.length > 0"
          class="mt-3"
          v-for="(file, _) in getFiles.filter((item: any) => item.columnName == props.columnName)"
          @click="downLoadFile(file)"
          @click:close="deleteFile"
          closable
          color="info"
        >
          {{ file.fileName }}
        </v-chip>
      </v-col>
    </v-row>
  </div>
</template>
