// import { invokeApi } from "../utils/invokeApi";
import { mockUsers } from "../mockData/auth";
import { simulateApiDelay } from "../mockData/auth";

export const _users_list_api = async (page, limit, search = "", filters = {}) => {
    // Mock implementation
    await simulateApiDelay(800);
    
    let filteredUsers = [...mockUsers];
    
    // Apply search filter
    if (search) {
        filteredUsers = filteredUsers.filter(user =>
            user.first_name.toLowerCase().includes(search.toLowerCase()) ||
            user.last_name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    // Apply status filter
    if (filters.status === "true") {
        filteredUsers = filteredUsers.filter(user => user.status === true);
    } else if (filters.status === "false") {
        filteredUsers = filteredUsers.filter(user => user.status === false);
    }
    
    const total_count = filteredUsers.length;
    const total_pages = Math.ceil(total_count / limit);
    const startIndex = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);
    
    return {
        code: 200,
        data: {
            users: paginatedUsers,
            pagination: {
                total_count,
                total_pages,
                current_page: page,
                per_page: limit
            },
            filters_applied: filters
        }
    };
    
    /*
    const params = new URLSearchParams({
        page: page,
        limit: limit,
        search: search || "",
    });
  
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, value);
        }
    });

    const requestObj = {
        path: `api/admin/users?${params.toString()}`,
        method: "GET",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken") || "",
        },
    };

    return invokeApi(requestObj);
    */
};

export const _user_detail_view_api = async (rowID, data) => {
    // Mock implementation
    await simulateApiDelay(600);
    
    const userIndex = mockUsers.findIndex(u => u._id === rowID);
    
    if (userIndex !== -1) {
        mockUsers[userIndex] = {
            ...mockUsers[userIndex],
            ...data,
        };
        
        const { password, ...userWithoutPassword } = mockUsers[userIndex];
        
        return {
            code: 200,
            message: "User updated successfully",
            data: userWithoutPassword
        };
    } else {
        return {
            code: 404,
            message: "User not found"
        };
    }
    
    /*
    const requestObj = {
        path: `api/admin/users/${rowID}`,
        method: "PUT",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
        postData: data,
    };
    return invokeApi(requestObj);
    */
};

export const _edit_user_api = async (rowID, data) => {
    // Mock implementation
    await simulateApiDelay(1000);
    
    const userIndex = mockUsers.findIndex(u => u._id === rowID);
    
    if (userIndex !== -1) {
        mockUsers[userIndex] = {
            ...mockUsers[userIndex],
            ...data,
        };
        
        const { password, ...userWithoutPassword } = mockUsers[userIndex];
        
        return {
            code: 200,
            message: "User updated successfully",
            data: userWithoutPassword
        };
    } else {
        return {
            code: 404,
            message: "User not found"
        };
    }
    
    /*
    const requestObj = {
        path: `api/admin/users/${rowID}`,
        method: "PUT",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
        postData: data,
    };
    return invokeApi(requestObj);
    */
};

export const _delete_user_api = async (rowID) => {
    // Mock implementation
    await simulateApiDelay(800);
    
    const userIndex = mockUsers.findIndex(u => u._id === rowID);
    
    if (userIndex !== -1) {
        mockUsers.splice(userIndex, 1);
        
        return {
            code: 200,
            message: "User deleted successfully"
        };
    } else {
        return {
            code: 404,
            message: "User not found"
        };
    }
    
    /*
    const requestObj = {
        path: `api/admin/users/${rowID}`,
        method: "DELETE",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
    };
    return invokeApi(requestObj);
    */
};
