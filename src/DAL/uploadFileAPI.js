import { invokeApi } from "../utils/invokeApi";
import { simulateApiDelay } from "../mockData";

export const _uplaod_file_on_s3 = async (data) => {
    // Mock implementation
    await simulateApiDelay(1500);
    
    // Simulate file upload
    const mockFileName = "mock_file_" + Date.now() + ".jpg";
    
    return {
        code: 200,
        message: "File uploaded successfully",
        path: mockFileName
    };
    
    /*
    const requestObj = {
      path: `api/admin/upload_file`,
      method: "POST",
      headers: {
        "x-sh-auth": localStorage.getItem("authToken"),
        "Content-Type": "multipart/form-data",
      },
      postData: data,
    };
    return invokeApi(requestObj);
    */
  };

export const _delete_file_from_s3 = async (data) => {
    // Mock implementation
    await simulateApiDelay(800);
    
    return {
        code: 200,
        message: "File deleted successfully"
    };
    
    /*
    const requestObj = {
      path: `api/admin/remove_file`,
      method: "DELETE",
      headers: {
        "x-sh-auth": localStorage.getItem("authToken"),
        // "Content-Type": "multipart/form-data",
      },
      postData: data,
    };
    return invokeApi(requestObj);
    */
  };
