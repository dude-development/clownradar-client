import { createAction } from "redux-act"

export const login = createAction("app/login")
export const logout = createAction("app/logout")

export const spawn = createAction("clown/spawn")
export const dispose = createAction("clown/dispose")
export const update = createAction("clown/update")
