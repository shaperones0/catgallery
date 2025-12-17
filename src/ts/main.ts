import '../css/style.css'

(() => {
    'use strict'

    const catCounter = document.getElementById('catCounter') as HTMLElement
    const inpAddTitle = document.getElementById('fAddTitle') as HTMLInputElement
    const inpAddCategory = document.getElementById('fAddCategory') as HTMLInputElement
    const inpAddUrl = document.getElementById('fAddUrl') as HTMLInputElement
    const btnAddSubmit = document.getElementById('fAddSubmit') as HTMLButtonElement
    const cbAddClear = document.getElementById('fAddClear') as HTMLInputElement
    const inpSearch = document.getElementById('fSearch') as HTMLInputElement

    const divGallery = document.getElementById('gallery') as HTMLDivElement
    const tblGallery = (document.getElementById('tblGallery') as HTMLTableElement).querySelector('tbody') as HTMLTableSectionElement
    const tmpCard = document.getElementById('tmpCard') as HTMLTemplateElement
    const tmpCategory = document.getElementById('tmpCategory') as HTMLTemplateElement

    const mdl = document.getElementById('modal')!
    const mdlMsg = document.getElementById('mdlMsg')!
    const mdlMsgTitle = mdlMsg.querySelector('.modal-title') as HTMLElement
    const mdlMsgBody = mdlMsg.querySelector('.modal-body') as HTMLElement

    const mdlCard = document.getElementById('mdlCard')!
    const mdlCardTitle = mdlCard.querySelector('.modal-title') as HTMLElement
    const mdlCardImg = document.getElementById('mdlCardImg') as HTMLImageElement
    const btnMdlCardDelete = document.getElementById('mdlCardDelete') as HTMLButtonElement
    const btnMdlCardFav = document.getElementById('mdlCardFav') as HTMLButtonElement

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

    const posts: Post[] = [
        {
            title: 'бело-серый',
            author: 'admin',
            url: 'cat0.jpg',
            favBy: new Set(),
        },
    ]

    let user: User | null = null;

    function hcForEach(col: HTMLCollection, cb: (el: HTMLElement) => any) {
        for (let idx = 0; idx < col.length; idx++) {
            cb(col.item(idx) as HTMLElement)
        }
    }

    const postClick = (post: Post) => {
        console.log("bruh")
        modalCard(post)
    }

    const modalHide = () => {
        mdl.classList.remove('show')
    }

    const modalShow = (id: string) => {
        mdl.classList.add("show")
        hcForEach(mdl.children, (node) => {
            node.style.display = (id === node.id) ? 'block' : 'none'
        })
    }

    const modalMsg = (title: string, message: string) => {
        modalShow(mdlMsg.id)
    }

    const modalCard = (post: Post) => {
        modalShow(mdlCard.id)
    }

    const renderCategory = (categoryName: string): HTMLParagraphElement => {
        const frag = document.importNode(tmpCategory.content, true)
        const elCategoryTitle = frag.querySelector('p') as HTMLParagraphElement
        elCategoryTitle.innerText = categoryName
        return elCategoryTitle
    }

    const renderPost = (post: Post): HTMLDivElement => {
        const frag = document.importNode(tmpCard.content, true)
        const elPost = frag.querySelector('div') as HTMLDivElement
        const elPostImg = elPost.querySelector('img') as HTMLImageElement
        const elPostTitle = elPost.querySelector('p') as HTMLParagraphElement
        elPostImg.src = post.url
        elPostTitle.innerText = post.title
        elPost.addEventListener('click', () => postClick(post))
        return elPost
    }

    const layoutPosts = (posts: HTMLDivElement[]): HTMLTableRowElement[] => {
        const rows: HTMLTableRowElement[] = []
        let curRow: HTMLTableRowElement | null = null
        for (let i = 0; i < posts.length; i++) {
            const elTd = document.createElement('td')
            elTd.appendChild(posts.at(i)!)
            if (curRow === null) {
                curRow = document.createElement('tr')
            }
            curRow.appendChild(elTd)
            if (curRow.childElementCount >= 3) {
                rows.push(curRow)
                curRow = null
            }
        }
        if (curRow !== null) {
            rows.push(curRow)
        }
        return rows
    }

    const renderGallery = () => {
        tblGallery.innerHTML = ''
        const filter = inpSearch.value

        if (filter === '' && user !== null) {
            //gather favorites

        }

        let category2elems = new Map<string, Post[]>()
        posts.forEach((post) => {
            if (!post.title.includes(filter)) return

            let elems = category2elems.get(post.author)
            if (elems === undefined) {
                elems = []
                category2elems.set(post.author, elems)
            }
            elems.push(post)
        })
        category2elems = new Map([...category2elems.entries()].sort());

        category2elems.forEach((cards, category) => {
            tblGallery.appendChild(renderCategory(category + ` (${cards.length})`))
            const elPosts = cards.map(renderPost)
            layoutPosts(elPosts).forEach((row) => {
                tblGallery.appendChild(row)
            })
        })

        catCounter.innerText = (posts.length === 0) ? '0 котов...' : posts.length + ' котов!'
    }

    const renderAdmin = () => {

    }

    const render = () => {
        renderGallery()

        if (user !== null) {
            if (user.is_staff) {
                renderAdmin()
            }
        }
    }

    render()

})()
