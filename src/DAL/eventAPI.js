// import { invokeApi } from "../utils/invokeApi";
import { mockEvents } from "../mockData/events";
import { simulateApiDelay } from "../mockData/auth";

export const _events_list_api = async (page, limit, search = "", filters = {}) => {
    // Mock implementation
    await simulateApiDelay(800);
    
    let filteredEvents = [...mockEvents];
    
    // Apply search filter
    if (search) {
        filteredEvents = filteredEvents.filter(event =>
            event.title.toLowerCase().includes(search.toLowerCase()) ||
            event.description.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    // Apply status filter
    if (filters.status && filters.status !== "all") {
        filteredEvents = filteredEvents.filter(event => event.status === filters.status);
    }
    
    // Apply paid only filter
    if (filters.paid_only === "true") {
        filteredEvents = filteredEvents.filter(event => event.isPaidEvent === true);
    }
    
    // Apply public only filter
    if (filters.public_only === "true") {
        filteredEvents = filteredEvents.filter(event => event.is_public === true);
    }
    
    // Apply date filters
    if (filters.created_from) {
        filteredEvents = filteredEvents.filter(event => 
            new Date(event.createdAt) >= new Date(filters.created_from)
        );
    }
    if (filters.created_to) {
        filteredEvents = filteredEvents.filter(event => 
            new Date(event.createdAt) <= new Date(filters.created_to)
        );
    }
    
    const total_count = filteredEvents.length;
    const total_pages = Math.ceil(total_count / limit);
    
    return {
        code: 200,
        data: {
            events: filteredEvents,
            total_count,
            total_pages,
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
        path: `api/admin/events?${params.toString()}`,
        method: "GET",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken") || "",
        },
    };

    return invokeApi(requestObj);
    */
};


export const _event_detail_view_api = async (rowID) => {
    // Mock implementation
    await simulateApiDelay(600);
    
    const event = mockEvents.find(e => e._id === rowID);
    
    if (event) {
        return {
            code: 200,
            data: event
        };
    } else {
        return {
            code: 404,
            message: "Event not found"
        };
    }
    
    /*
    const requestObj = {
        path: `api/events/${rowID}`,
        method: "GET",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
    };
    return invokeApi(requestObj);
    */
};

export const _add_event_api = async (data) => {
    // Mock implementation
    await simulateApiDelay(1000);
    
    const newEvent = {
        _id: "event_" + Date.now(),
        ...data,
        current_attendees: 0,
        slug: data.title.toLowerCase().replace(/\s+/g, '-'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    
    mockEvents.push(newEvent);
    
    return {
        code: 200,
        message: "Event created successfully",
        data: newEvent
    };
    
    /*
    const requestObj = {
        path: `api/admin/events`,
        method: "POST",
        postData: data,
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
    };
    return invokeApi(requestObj);
    */
};

export const _edit_event_api = async (rowID, data) => {
    // Mock implementation
    await simulateApiDelay(1000);
    
    const eventIndex = mockEvents.findIndex(e => e._id === rowID);
    
    if (eventIndex !== -1) {
        mockEvents[eventIndex] = {
            ...mockEvents[eventIndex],
            ...data,
            updatedAt: new Date().toISOString(),
        };
        
        return {
            code: 200,
            message: "Event updated successfully",
            data: mockEvents[eventIndex]
        };
    } else {
        return {
            code: 404,
            message: "Event not found"
        };
    }
    
    /*
    const requestObj = {
        path: `api/events/${rowID}`,
        method: "PUT",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
        postData: data,
    };
    return invokeApi(requestObj);
    */
};
