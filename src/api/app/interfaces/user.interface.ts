interface User {
    id      ?: number,
    name    ?: string
    forename?: string
    email   ?: string
    password?: string
    isadmin ?: boolean
    status  ?: boolean,
    creationDate ?: Date
}

export default User