<script setup lang="ts">
import i18n  from "@/app/config/i18n";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { useNotification } from "@kyvg/vue3-notification";
import { ref } from "vue";
import { CheckboxIcon, ChecksIcon, EyeIcon, FilePlusIcon, PencilIcon, SendIcon, TrashIcon, XIcon, XboxXIcon } from "vue-tabler-icons";
import { useAuth } from "@/app/config/store/auth";
import { IModalProps, ITableActions } from "@/models/basic";

interface IProps {
  permission?: string;
  item: any;
  service?: any;
  actions?: ITableActions;
  showStatusActions?: boolean;
  customFilter?: any;
}
const auth = useAuth();
const props = defineProps<IProps>();
const emits = defineEmits<{
  (e: "refresh"): void;
  (e: "edit", item: any, options?: any): void;
  (e: "view", item: any): void;
}>();
const { setError } = useErrorToast();
const notify = useNotification();
const selectedDeleteItem = ref<number>(0);
const deleteModal = ref<boolean>(false);
const isModal = ref<boolean>(false);
const statusLoading = ref<boolean>(false);

const openDeleteModal = (item: any) => {
  selectedDeleteItem.value = item.id;
  deleteModal.value = true;
};

const edit = (item: any) => {
  emits("edit", item);
};
const clone = (item: any) => {
  emits("edit", item, {
    query: {
      clone: "true"
    }
  });
};
const view = (item: any) => {
  emits("view", item);
};
interface ICustomModalProps extends IModalProps {
  item: any;
}

const isModalProps = ref<ICustomModalProps>({
  cb: "",
  id: null,
  title: "",
  item: {}
});

const openModal = ({ title, id, cb }: { title: string; id: number; cb: string }) => {
  isModalProps.value.title = title;
  isModalProps.value.id = id;
  isModalProps.value.cb = cb;
  // isModalProps.value.item = item;
  isModal.value = true;
};

const sentRequest = (cb: string) => {
  if (isModalProps.value.id) {
    statusLoading.value = true;
    // @ts-ignore
    props.service[cb]({ id: isModalProps.value.id, ...props.customFilter })
      .then(() => {
        isModal.value = false;
        notify.notify({
          // @ts-ignore
          text: i18n.global.t("successfullyChanged"),
          type: "success",
          closeOnClick: true
        });
        emits("refresh");
      })
      .catch((e: any) => {
        setError(e);
        isModal.value = false;
        emits("refresh");
      })
      .finally(() => {
        statusLoading.value = false;
      });
  }
};

const deleteItem = () => {
  statusLoading.value = true;
  props.service
    .Delete(selectedDeleteItem.value)
    .then(() => {
      deleteModal.value = false;
      notify.notify({
        // @ts-ignore
        text: i18n.global.t("DeleteSuccess"),
        type: "success"
      });
      emits("refresh");
    })
    .catch((err: any) => {
      setError(err);
      deleteModal.value = false;
      emits("refresh");
    })
    .finally(() => {
      statusLoading.value = false;
    });
};

const isShow = ({ action, permission, itemAction }: { action?: boolean; permission: boolean; itemAction?: boolean }): boolean | undefined => {
  if (typeof itemAction === "boolean") {
    return itemAction;
  } else {
    if (action && permission) {
      return true;
    }
    if (!action || !permission) {
      return false;
    }
  }
  return true;
};
</script>

<template>
  <div>
    <div class="text-center d-flex align-center flex-wrap justify-center">
      <slot name="Edit" :openModal="openModal" :isShow="isShow" :ability="auth">
        <div
          v-if="
            isShow({
              action: actions?.isEdit,
              permission: auth.can(`${permission}Edit`),
              itemAction: item.canEdit
            })
          "
          style="margin-right: 5px"
        >
          <PencilIcon size="20" style="cursor: pointer" @click="edit(item)" />
          <v-tooltip activator="parent" location="top">
            {{ $t("Edit") }}
          </v-tooltip>
        </div>
      </slot>
      <slot name="Delete" :openModal="openModal" :isShow="isShow" :ability="auth">
        <div
          v-if="
            isShow({
              action: actions?.isDelete,
              permission: auth.can(`${permission}Delete`),
              itemAction: item.canDelete
            })
          "
          style="margin-right: 5px"
        >
          <TrashIcon size="20" style="cursor: pointer" @click="openDeleteModal(item)" />
          <v-tooltip activator="parent" location="top">
            {{ $t("Delete") }}
          </v-tooltip>
        </div>
      </slot>
      <slot name="View" :openModal="openModal" :isShow="isShow" :ability="auth">
        <div @click="view(item)" v-if="auth.can(`${permission}View`) && actions?.isView" style="margin-right: 5px">
          <v-tooltip activator="parent" location="top">
            {{ $t("View") }}
          </v-tooltip>
          <EyeIcon size="20" style="cursor: pointer" />
        </div>
      </slot>
      <slot name="Clone" :openModal="openModal" :isShow="isShow" :ability="auth">
        <div @click="clone(item)" v-if="actions?.isClone">
          <v-tooltip activator="parent" location="top">
            {{ $t("clone") }}
          </v-tooltip>
          <FilePlusIcon size="20" style="cursor: pointer" />
        </div>
      </slot>
      <slot :openModal="openModal" :isShow="isShow" :ability="auth" name="Approve">
        <div
          style="margin-right: 5px; cursor: pointer"
          @click="
            openModal({
              title: 'Approve',
              id: item.id,
              cb: 'Approve',
              // item: item
            })
          "
          v-if="
            isShow({
              action: actions?.canApprove,
              permission: auth.can(`${permission}Approve`),
              itemAction: item.canApprove
            }) && showStatusActions
          "
        >
          <v-tooltip activator="parent" location="top">
            {{ $t("Approve") }}
          </v-tooltip>
          <CheckboxIcon color="#05b187" />
        </div>
      </slot>
      <slot :openModal="openModal" :ability="auth" :isShow="isShow" name="Accept">
        <div
          style="margin-right: 5px; cursor: pointer"
          @click="
            openModal({
              title: 'Accept',
              id: item.id,
              cb: 'Accept',
              // item: item
            })
          "
          v-if="
            isShow({
              action: actions?.canAccept,
              permission: auth.can(`${permission}Accept`),
              itemAction: item.canAccept
            }) && showStatusActions
          "
        >
          <v-tooltip activator="parent" location="top">
            {{ $t("Accept") }}
          </v-tooltip>
          <ChecksIcon color="#05b187" />
        </div>
      </slot>
      <slot :openModal="openModal" :ability="auth" :isShow="isShow" name="Cancel">
        <div
          style="margin-right: 5px; cursor: pointer"
          @click="
            openModal({
              title: 'Cancel',
              id: item.id,
              cb: 'Cancel',
              // item: item
            })
          "
          v-if="
            isShow({
              action: actions?.canCancel,
              permission: auth.can(`${permission}Cancel`),
              itemAction: item.canCancel
            }) && showStatusActions
          "
        >
          <v-tooltip activator="parent" location="top">
            {{ $t("Cancel") }}
          </v-tooltip>
          <XIcon color="rgb(var(--v-theme-error))" />
        </div>
      </slot>
      <slot :openModal="openModal" :ability="auth" :isShow="isShow" name="Reject">
        <div
          style="margin-right: 5px; cursor: pointer"
          @click="
            openModal({
              title: 'Reject',
              id: item.id,
              cb: 'Reject',
              // item: item
            })
          "
          v-if="
            isShow({
              action: actions?.canReject,
              permission: auth.can(`${permission}Reject`),
              itemAction: item.canReject
            }) && showStatusActions
          "
        >
          <v-tooltip activator="parent" location="top">
            {{ $t("Reject") }}
          </v-tooltip>
          <XboxXIcon color="rgb(var(--v-theme-error))" />
        </div>
      </slot>
      <slot :openModal="openModal" :ability="auth" :isShow="isShow" name="Sent">
        <div
          style="margin-right: 5px; cursor: pointer"
          @click="
            openModal({
              title: 'Sent1',
              id: item.id,
              cb: 'Sent',
              // item: item
            })
          "
          v-if="
            isShow({
              action: actions?.canSent,
              permission: auth.can(`${permission}Sent`),
              itemAction: item.canSent
            }) && showStatusActions
          "
        >
          <v-tooltip activator="parent" location="top">
            {{ $t("Sent1") }}
          </v-tooltip>
          <SendIcon color="rgb(var(--v-theme-info))" />
        </div>
      </slot>
      <slot name="action" :isShow="isShow" :ability="auth" :openModal="openModal" :sentRequest="sentRequest"></slot>
    </div>
    <slot name="outAction" :isShow="isShow" :ability="auth" :openModal="openModal" :sentRequest="sentRequest"></slot>
    <!-- MODALS -->
    <v-dialog v-model="deleteModal" width="300">
      <v-card>
        <v-card-text>
          {{ $t("WantDelete") }}
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn :loading="statusLoading" color="error" variant="flat" block @click="deleteModal = false">
                {{ $t("no") }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn :loading="statusLoading" color="success" variant="flat" block @click="deleteItem">
                {{ $t("yes") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isModal" width="300">
      <v-card class="mx-2 my-2">
        <v-card-title>{{ $t(`${isModalProps.title}`) }}</v-card-title>
        <v-card-text class="py-0">
          <slot name="modal-text" :isModalProps="isModalProps"> ID: {{ isModalProps.id }} </slot>
          <!-- ID: {{ isModalProps.id }}  -->
        </v-card-text>

        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn :loading="statusLoading" color="error" variant="flat" block @click="isModal = false">
                {{ $t("no") }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn :loading="statusLoading" color="success" variant="flat" block @click="sentRequest(isModalProps.cb)">
                {{ $t("yes") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
