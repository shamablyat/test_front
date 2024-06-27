import { IFileConfigBody } from "@/models/basic";
import ApiService from "../api.service";

const FileConfigService = {
  FileConfig(data: IFileConfigBody) {
    return ApiService.post(`/FileConfig`, data);
  }
};
export default FileConfigService;
