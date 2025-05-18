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
          "Authorization": `Bearer ${token}`, // include auth token in header
        },
        body: JSON.stringify(data)
      }
    } else {
      payload = {
        method: method,
        credentials: "omit",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // include auth token in header
        }
      }
      // Append query string to URL
      if (queryString != "") url+= `?${queryString}`;
    }
    
    const response = await fetch(url, payload)
    const statusCode = response.status
    
    // parse response
    let responseData
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json()
    } else {
      responseData = await response.text()
    }
    
    if (!response.ok) {
      return {
        status: "error",
        // handle errors or timeouts
        message: typeof responseData === "object" && responseData !== null 
          ? (responseData.message || responseData.error || "API request failed") 
          : "API request failed",
        statusCode
      }
    }
    
    return {
      data: responseData as T,
      statusCode,
    }
  } catch (error) {
    // handle client-side errors
    console.error("API request error:", error)
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
      statusCode: 500,
    }
  }
}

export const authApi = {
  login: async (username: string, password: string) => {
    interface LoginResponse {
      status: string
      message: string
      data: {
        token: string
        expires_in: number
      }
    }
    
    // POST request with no query strings and username/password payload
    const result = await apiRequest<LoginResponse>("/login.php", "POST", "", { username, password })
    
    if (result.data && result.data.status === "success" && result.data.data) {
      return {
        data: {
          token: result.data.data.token,
          expires_in: result.data.data.expires_in
        },
        statusCode: result.statusCode
      }
    }
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
  // get list of login credentials
  getLoginList: async () => {
    return apiRequest("/users.php", "GET", "loginlist")
  },
  getUser: async (user: string) => {
    return apiRequest("/users.php", "GET", `user=${encodeURIComponent(user)}`)
  },
  addUser: async (userData: any) => {
    return apiRequest("/users.php", "POST", "", userData)
  },
  updateUser: async (userId: string, userData: any) => {
    userData["id"] = userId
    return apiRequest("/users.php", "PATCH", "", userData)
  },
  deleteUser: async (userId: string) => {
    return apiRequest("/users.php", "DELETE", "", {id: userId})
  }
}

export const parkingApi = {
  // get list of parking lot addresses and IDs
  getLots: async () => {
    return apiRequest("/parking.php", "GET", "")
  },
  // get list of spaces in lot with option to specify floor
  getLot: async (lotID: number, floor=-1) => {
    // for some reason you can't set the floor string to "" and then append it
    // probably because PHP is a trash doo doo language
    if (floor === -1) {
      return apiRequest("/parking.php", "GET", `lot_id=${encodeURIComponent(lotID)}`)
    }
    return apiRequest("/parking.php", "GET", `lot_id=${encodeURIComponent(lotID)}&floor=${encodeURIComponent(floor)}`)
  },
  // generate new permit for lot
  newParkingSlip: async (lotID: number) => {
    return apiRequest("/parking.php", "GET", `lot_id=${encodeURIComponent(lotID)}&action=park`)
  },
  // get total to charge for exiting car
  customerCheckout: async (parkingSlip: string) => {
    return apiRequest("/parking.php", "GET", `slip_id=${encodeURIComponent(parkingSlip)}&action=exit`)
  }
}