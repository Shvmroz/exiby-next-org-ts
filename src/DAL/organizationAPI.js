// import { invokeApi } from "../utils/invokeApi";
import { mockOrganizations } from "../mockData/organizations";
import { simulateApiDelay } from "../mockData/auth";

export const _organizations_list_api = async (page, limit, search = "", filters = {}) => {
    // Mock implementation
    await simulateApiDelay(800);
    
    let filteredOrganizations = [...mockOrganizations];
    
    // Apply search filter
    if (search) {
        filteredOrganizations = filteredOrganizations.filter(org =>
            org.orgn_user.name.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    // Apply status filter
    if (filters.status === "true") {
        filteredOrganizations = filteredOrganizations.filter(org => org.status === true);
    } else if (filters.status === "false") {
        filteredOrganizations = filteredOrganizations.filter(org => org.status === false);
    }
    
    const total_count = filteredOrganizations.length;
    const total_pages = Math.ceil(total_count / (limit || 10));
    
    return {
        code: 200,
        data: {
            organizations: filteredOrganizations,
            pagination: {
                total_count,
                total_pages,
                current_page: page || 1,
                per_page: limit || 10
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
        path: `api/admin/organizations?${params.toString()}`,
        method: "GET",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken") || "",
        },
    };

    return invokeApi(requestObj);
    */
};


export const _organization_detail_view_api = async (rowID) => {
    // Mock implementation
    await simulateApiDelay(600);
    
    const organization = mockOrganizations.find(o => o._id === rowID);
    
    if (organization) {
        return {
            code: 200,
            data: {
                organization: organization
            }
        };
    } else {
        return {
            code: 404,
            message: "Organization not found"
        };
    }
    
    /*
    const requestObj = {
        path: `api/admin/organizations/${rowID}`,
        method: "GET",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
    };
    return invokeApi(requestObj);
    */
};

export const _add_organization_api = async (data) => {
    // Mock implementation
    await simulateApiDelay(1000);
    
    const newOrganization = {
        _id: "org_" + Date.now(),
        orgn_user: {
            _id: "org_user_" + Date.now(),
            name: data.name,
        },
        total_events: 0,
        total_revenue: 0,
        status: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    
    mockOrganizations.push(newOrganization);
    
    return {
        code: 200,
        message: "Organization created successfully",
        data: newOrganization
    };
    
    /*
    const requestObj = {
        path: `api/organization/register`,
        method: "POST",
        postData: data,
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
    };
    return invokeApi(requestObj);
    */
};

export const _edit_organizations_api = async (rowID, data) => {
    // Mock implementation
    await simulateApiDelay(1000);
    
    const orgIndex = mockOrganizations.findIndex(o => o._id === rowID);
    
    if (orgIndex !== -1) {
        mockOrganizations[orgIndex] = {
            ...mockOrganizations[orgIndex],
            ...data,
            updatedAt: new Date().toISOString(),
        };
        
        return {
            code: 200,
            message: "Organization updated successfully",
            data: mockOrganizations[orgIndex]
        };
    } else {
        return {
            code: 404,
            message: "Organization not found"
        };
    }
    
    /*
    const requestObj = {
        path: `api/organization/profile/${rowID}`,
        method: "PUT",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
        postData: data,
    };
    return invokeApi(requestObj);
    */
};

