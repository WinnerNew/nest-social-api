import * as packageJson from "../../../package.json";

/**
 * 版本信息管理
 */
export class VersionService {
  /**
   * 获取当前应用版本
   */
  static getVersion(): string {
    return packageJson.version;
  }

  /**
   * 获取应用名称
   */
  static getAppName(): string {
    return packageJson.name;
  }

  /**
   * 获取完整的版本信息
   */
  static getVersionInfo() {
    return {
      name: this.getAppName(),
      version: this.getVersion(),
      description: packageJson.description || "",
      author: packageJson.author || "",
      license: packageJson.license || "",
    };
  }
}
