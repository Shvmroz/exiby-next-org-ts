import { invokeApi } from "../utils/invokeApi";
import { mockCompanies, simulateApiDelay } from "../mockData";

export const _companies_list_api = async (page, limit, search = "", filters = {}) => {
    // Mock implementation
    await simulateApiDelay(800);
    
    let filteredCompanies = [...mockCompanies];
    
    // Apply search filter
    if (search) {
        filteredCompanies = filteredCompanies.filter(company =>
            company.orgn_user.name.toLowerCase().includes(search.toLowerCase()) ||
            company.bio.description.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    // Apply status filter
    if (filters.status === "true") {
        filteredCompanies = filteredCompanies.filter(company => company.status === true);
    } else if (filters.status === "false") {
        filteredCompanies = filteredCompanies.filter(company => company.status === false);
    }
    
    // Apply date filters
    if (filters.created_from) {
        filteredCompanies = filteredCompanies.filter(company => 
            new Date(company.createdAt) >= new Date(filters.created_from)
        );
    }
    if (filters.created_to) {
        filteredCompanies = filteredCompanies.filter(company => 
            new Date(company.createdAt) <= new Date(filters.created_to)
        );
    }
    
    const total_count = filteredCompanies.length;
    const total_pages = Math.ceil(total_count / limit);
    const startIndex = (page - 1) * limit;
    const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + limit);
    
    return {
        code: 200,
        data: {
            companies: paginatedCompanies,
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
        path: `api/admin/companies?${params.toString()}`,
        method: "GET",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken") || "",
        },
    };

    return invokeApi(requestObj);
    */
};


export const _company_detail_view_api = async (rowID) => {
    // Mock implementation
    await simulateApiDelay(600);
    
    const company = mockCompanies.find(c => c._id === rowID);
    
    if (company) {
        return {
            code: 200,
            data: {
                company: company
            }
        };
    } else {
        return {
            code: 404,
            message: "Company not found"
        };
    }
    
    /*
    const requestObj = {
        path: `api/organization/companies/${rowID}`,
        method: "GET",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
    };
    return invokeApi(requestObj);
    */
};

export const _add_company_api = async (data) => {
    // Mock implementation
    await simulateApiDelay(1000);
    
    const newCompany = {
        _id: "comp_" + Date.now(),
        orgn_user: {
            _id: "org_" + Date.now(),
            name: data.name,
        },
        bio: data.bio,
        social_links: data.social_links,
        contact: data.contact,
        status: true,
        total_events: 0,
        total_payments: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    
    mockCompanies.push(newCompany);
    
    return {
        code: 200,
        message: "Company created successfully",
        data: newCompany
    };
    
    /*
    const requestObj = {
        path: `api/organization/register_company`,
        method: "POST",
        postData: data,
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
    };
    return invokeApi(requestObj);
    */
};

export const _edit_company_api = async (rowID, data) => {
    // Mock implementation
    await simulateApiDelay(1000);
    
    const companyIndex = mockCompanies.findIndex(c => c._id === rowID);
    
    if (companyIndex !== -1) {
        mockCompanies[companyIndex] = {
            ...mockCompanies[companyIndex],
            ...data,
            updatedAt: new Date().toISOString(),
        };
        
        return {
            code: 200,
            message: "Company updated successfully",
            data: mockCompanies[companyIndex]
        };
    } else {
        return {
            code: 404,
            message: "Company not found"
        };
    }
    
    /*
    const requestObj = {
        path: `api/organization/companies/${rowID}`,
        method: "PUT",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
        postData: data,
    };
    return invokeApi(requestObj);
    */
};
