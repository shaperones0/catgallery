import '../css/style.css'

(() => {
    'use strict'

    type User = {
        name: string,
        pfp_url: string,
        is_staff: boolean,
        is_admin: boolean,
    }

    type Post = {
        title: string,
        author: string,
        url: string,
        favBy: Set<string>,
    }

    const users: User[] = [
        {
            name: 'admin',
            pfp_url: 'pfp-admin.jpg',
            is_staff: true,
            is_admin: true,
        },
        {
            name: 'belyash',
            pfp_url: 'pfp-belyash.jpg',
            is_staff: false,
            is_admin: false,
        },
        {
            name: 'chernysh',
            pfp_url: 'pfp-chernysh.jpg',
            is_staff: false,
            is_admin: false,
        },
        {
            name: 'lazaga',
            pfp_url: 'pfp-lazaga.jpg',
            is_staff: false,
            is_admin: false,
        },
        {
            name: 'liberty',
            pfp_url: 'pfp-liberty.jpg',
            is_staff: false,
            is_admin: false,
        },
        {
            name: 'lopouh',
            pfp_url: 'pfp-lopouh.jpg',
            is_staff: false,
            is_admin: false,
        },
        {
            name: 'smol',
            pfp_url: 'pfp-smol.jpg',
            is_staff: false,
            is_admin: false,
        },
        {
            name: 'tux',
            pfp_url: 'pfp-tux.jpg',
            is_staff: false,
            is_admin: false,
        },
    ]

    const posts: Post[] = []

    console.log(users, posts)

})()
