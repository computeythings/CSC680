type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export interface ApiResponse<T = any> {
  data?: T
  message?: string
  status?: string
  statusCode: number
}

// Get auth token from cookie
const getToken = (): string | null => {
    if (typeof window === "undefined") return null
  
    const cookieName = "AUTH_TOKEN="
    const cookies = document.cookie.split(";")
  
    for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim()
    if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length)
    }
  }
  return null
}

export async function apiRequest<T = any>(
  endpoint: string,
  method: Method = "GET",
  queryString?: string,
  data?: any
): Promise<ApiResponse<T>> {
  try {
    let url = `/api/v1${endpoint}`
    const token = getToken()
    let payload = {}
    
    // add body for non-GET requests
    if (method !== "GET" && data) {
      payload = {
        method: method,
        credentials: "omit",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      }
    } else {
      payload = {
        method: method,
        credentials: "omit",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      }
      if (queryString != "") url+= `?${queryString}`;
    }
    
    const response = await fetch(url, payload)
    console.log(response)
    const statusCode = response.status
    
    // parse response
    let responseData
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json()
    } else {
      responseData = await response.text()
    }
    
    // Check for API error responses in different formats
    if (!response.ok) {
      return {
        status: "error",
        message: typeof responseData === "object" && responseData !== null 
          ? (responseData.message || responseData.error || "API request failed") 
          : "API request failed",
        statusCode,
      }
    }
    
    // For successful responses
    return {
      data: responseData as T,
      statusCode,
    }
  } catch (error) {
    console.error("API request error:", error)
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
      statusCode: 500,
    }
  }
}

export const authApi = {
  // Login user
  login: async (username: string, password: string) => {
    interface LoginResponse {
      status: string
      message: string
      data: {
        token: string
        expires_in: number
        user?: any // Optional user data that might be included
      }
    }
    
    const result = await apiRequest<LoginResponse>("/login.php", "POST", "", { username, password })
    
    // Transform the response structure to match what our app expects
    if (result.data && result.data.status === "success" && result.data.data) {
      return {
        data: {
          token: result.data.data.token,
          expires_in: result.data.data.expires_in,
          // If user data is not included in the response, we might need to fetch it separately
          user: result.data.data.user || { id: "unknown", username: username }
        },
        statusCode: result.statusCode
      }
    }
    
    // Return the error if login failed
    return {
      error: result.status === "error" || (result.data?.message || "Login failed"),
      statusCode: result.statusCode
    }
  },
}

/**
 * Users API functions
 */
export const usersApi = {
  // Get user by username
  getLoginList: async () => {
    return apiRequest("/users.php", "GET", "loginlist")
  },
  // Get user by username
  getUser: async (user: string) => {
    return apiRequest("/users.php", "GET", `user=${encodeURIComponent(user)}`)
  },
  // Update user
  addUser: async (userData: any) => {
    return apiRequest("/users.php", "POST", "", userData)
  },
  // Update user
  updateUser: async (userId: string, userData: any) => {
    userData["id"] = userId
    return apiRequest("/users.php", "PATCH", "", userData)
  },
  // Delete user
  deleteUser: async (userId: string) => {
    return apiRequest("/users.php", "DELETE", "", {id: userId})
  }
}

// Add other API modules as needed for your application