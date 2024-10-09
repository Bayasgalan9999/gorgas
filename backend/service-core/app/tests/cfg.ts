import request from "supertest"
// import app from "../src/app"

export const BASE_URL = 'http://localhost:1488'
export const reqApp = request(BASE_URL)
// export const reqApp = request(app)
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
export let token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhMTFjZTExODI4Mjc5NzU2YjY5NmU3OSIsImlhdCI6MTY3ODE1NTk4M30.Da_lxSqq28krteE5nnJYdvUgyesrHXtdrA9biT0YP4s'