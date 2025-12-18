import '../css/style.css'

(() => {
    'use strict'

    const inpLogin = document.getElementById('fLoginUsername') as HTMLInputElement
    const btnLogin = document.getElementById('fLoginSubmit') as HTMLButtonElement

    const divToc = document.getElementById('toc') as HTMLDivElement

    const catCounter = document.getElementById('catCounter') as HTMLElement
    const fAdd = document.getElementById('fAdd') as HTMLFormElement
    const inpAddTitle = document.getElementById('fAddTitle') as HTMLInputElement
    const inpAddUrl = document.getElementById('fAddUrl') as HTMLInputElement
    const btnAddSubmit = document.getElementById('fAddSubmit') as HTMLButtonElement
    // const cbAddClear = document.getElementById('fAddClear') as HTMLInputElement
    const inpSearch = document.getElementById('fSearch') as HTMLInputElement

    const tblGallery = (document.getElementById('tblGallery') as HTMLTableElement).querySelector('tbody') as HTMLTableSectionElement
    const tmpCard = document.getElementById('tmpCard') as HTMLTemplateElement
    const tmpCategory = document.getElementById('tmpCategory') as HTMLTemplateElement

    const divAdmin = document.getElementById('admin') as HTMLDivElement
    const tmpAdminTable = document.getElementById('tmpAdminTable') as HTMLTemplateElement
    const tmpAdminRow = document.getElementById('tmpAdminRow') as HTMLTemplateElement

    const mdl = document.getElementById('modal')!
    const mdlMsg = document.getElementById('mdlMsg')!
    const mdlMsgTitle = mdlMsg.querySelector('h3')!
    const mdlMsgBody = mdlMsg.querySelector('p')!

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
        author: number,
        url: string,
        favBy: Set<number>,
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
            title: 'Томас',
            author: 0,
            url: 'cat0.jpg',
            favBy: new Set(),
        },
        {
            title: 'Рыжик',
            author: 0,
            url: 'cat1.jpg',
            favBy: new Set(),
        },
        {
            title: 'Bar$ik',
            author: 7,
            url: 'cat2.jpg',
            favBy: new Set(),
        },
        {
            title: 'Сажа Печная',
            author: 7,
            url: 'cat3.jpg',
            favBy: new Set(),
        },
        {
            title: 'Молния',
            author: 3,
            url: 'cat4.jpg',
            favBy: new Set(),
        },
        {
            title: 'Черныш',
            author: 2,
            url: 'cat5.jpg',
            favBy: new Set(),
        },
        {
            title: 'Мурзик',
            author: 7,
            url: 'cat6.jpg',
            favBy: new Set(),
        },
    ]

    let uid: number | null = null
    let selectedPost: Post | null = null

    const hcForEach = (col: HTMLCollection, cb: (el: HTMLElement) => any) => {
        for (let idx = 0; idx < col.length; idx++) {
            cb(col.item(idx) as HTMLElement)
        }
    }

    const isFav = (post: Post): boolean => {
        if (uid === null) return false
        return post.favBy.has(uid)
    }

    const canDelete = (post: Post): boolean => {
        if (uid === null) return false
        if (users[uid].is_staff || users[uid].is_admin) return true
        return uid === post.author
    }

    const canFav = (): boolean => {
        return uid !== null
    }

    const isAdmin = (): boolean => {
        if (uid === null) return false
        return (users[uid].is_staff)
    }

    const userMap = (filter: string): Map<number, Post[]> => {
        const author2elems = new Map<number, Post[]>()
        posts.forEach((post) => {
            if (!post.title.includes(filter)) return

            let elems = author2elems.get(post.author)
            if (elems === undefined) {
                elems = []
                author2elems.set(post.author, elems)
            }
            elems.push(post)
        })
        return new Map([...author2elems.entries()].sort())
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
        mdlMsgTitle.innerText = title
        mdlMsgBody.innerHTML = message
    }

    const modalCard = (post: Post) => {
        modalShow(mdlCard.id)
        mdlCardImg.src = post.url
        mdlCardTitle.innerText = post.title
        btnMdlCardDelete.style.display = canDelete(post) ? 'initial' : 'none'
        btnMdlCardFav.style.display = canFav() ? 'initial' : 'none'
        btnMdlCardFav.innerText = isFav(post) ? 'Удалить из избранного' : 'В избранное'
    }

    const renderAuthor = (user: User, postNumber: number): HTMLTableRowElement => {
        const frag = document.importNode(tmpCategory.content, true)
        const el = frag.querySelector('tr') as HTMLTableRowElement
        const elTd = el.querySelector('td') as HTMLTableCellElement
        const elCategoryTitle = elTd.querySelector('a') as HTMLAnchorElement
        const elCategoryImg = elTd.querySelector('img') as HTMLImageElement

        elCategoryImg.src = user.pfp_url
        elCategoryTitle.setAttribute('id', 'caT' + user.name)
        elCategoryTitle.innerText = `${user.name} (${postNumber})`
        return el
    }

    const renderCategory = (categoryName: string, postNumber: number): HTMLTableRowElement => {
        const frag = document.importNode(tmpCategory.content, true)
        const el = frag.querySelector('tr') as HTMLTableRowElement
        const elTd = el.querySelector('td') as HTMLTableCellElement
        const elCategoryTitle = elTd.querySelector('a') as HTMLAnchorElement
        const elCategoryImg = elTd.querySelector('img') as HTMLImageElement

        elTd.removeChild(elCategoryImg)
        elCategoryTitle.innerText = `${categoryName} (${postNumber})`
        return el
    }

    const renderPost = (post: Post): HTMLDivElement => {
        const frag = document.importNode(tmpCard.content, true)
        const elPost = frag.querySelector('div') as HTMLDivElement
        const elPostImg = elPost.querySelector('img') as HTMLImageElement
        const elPostTitle = elPost.querySelector('p') as HTMLParagraphElement
        elPostImg.src = post.url
        elPostTitle.innerText = post.title
        elPost.addEventListener('click', () => {
            selectedPost = post
            modalCard(post)
        })
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

        if (filter === '' && uid !== null) {
            //gather favorites
            const fav: Post[] = []
            posts.forEach((post) => {
                if (post.favBy.has(uid!)) fav.push(post)
            })

            if (fav.length !== 0) {
                //create fav cat
                tblGallery.appendChild(renderCategory(`Избранное`, fav.length))
                const elPosts = fav.map(renderPost)
                layoutPosts(elPosts).forEach((row) => {
                    tblGallery.appendChild(row)
                })
            }
        }

        const author2elems = userMap(filter)
        author2elems.forEach((cards, userId) => {
            tblGallery.appendChild(renderAuthor(users[userId], cards.length))
            const elPosts = cards.map(renderPost)
            layoutPosts(elPosts).forEach((row) => {
                tblGallery.appendChild(row)
            })
        })

        // render cat counter
        catCounter.innerText = (posts.length === 0) ? '0 котов...' : posts.length + ' котов!'

        // render form
        fAdd.style.display = (uid === null) ? 'none' : 'flex'

        // render toc
        divToc.innerHTML = '<h2>Содержание</h2>'
        author2elems.forEach((_, userId) => {
            const elP = document.createElement('p')
            const name = users[userId].name
            elP.innerText = name
            elP.classList.add('toc-link')
            elP.addEventListener('click', () => {
                document.getElementById('caT' + name)!.scrollIntoView(
                    {
                        block: 'center'
                    }
                )
            })
            divToc.appendChild(elP)
        })
    }

    const renderAdmin = () => {
        divAdmin.innerHTML = ''
        if (!isAdmin()) return;
        const author2elems = userMap('')

        const frag = document.importNode(tmpAdminTable.content, true)
        const elTable = frag.querySelector('table') as HTMLTableElement
        const elTbody = elTable.querySelector('tbody') as HTMLTableSectionElement
        divAdmin.appendChild(frag)

        users.forEach((user, idx) => {
            const elRow = document.importNode(tmpAdminRow.content, true).querySelector('tr') as HTMLTableRowElement
            const elsTd = elRow.querySelectorAll('td')

            const elTdNumber = elsTd.item(0)
            elTdNumber.innerText = idx.toString()

            const elTdName = elsTd.item(1)
            const inpName = elTdName.querySelector('input')!
            inpName.value = user.name

            const elTdNum = elsTd.item(2)
            const posts = author2elems.get(idx)
            if (posts === undefined) elTdNum.innerText = '0'
            else elTdNum.innerText = posts!.length.toString()

            const elTdUrl = elsTd.item(3)
            const inpUrl = elTdUrl.querySelector('input')!
            inpUrl.value = user.pfp_url

            const elTdIsAdmin = elsTd.item(4)
            const inpAdmin = elTdIsAdmin.querySelector('input')!
            inpAdmin.checked = user.is_admin

            const elTdIsModerator = elsTd.item(5)
            const inpModerator = elTdIsModerator.querySelector('input')!
            inpModerator.checked = user.is_staff

            const elTdSubmit = elsTd.item(6)
            const btnSubmit = elTdSubmit.querySelector('button')!
            btnSubmit.addEventListener('click', () => {
                user.name = inpName.value
                user.pfp_url = inpUrl.value
                user.is_admin = inpAdmin.checked
                user.is_staff = inpModerator.checked
                render()
            })

            elTbody.appendChild(elRow)
        })
    }

    const render = () => {
        renderGallery()
        renderAdmin()
    }

    btnLogin.addEventListener('click', () => {
        uid = null
        users.forEach((iUser, idx) => {
            if (iUser.name === inpLogin.value) {
                uid = idx
            }
        })

        render()
    })

    btnAddSubmit.addEventListener('click', () => {
        const errs = new Array()
        if (inpAddTitle.value === '') {
            errs.push('<li>Название не указано</li>')
        }
        if (inpAddUrl.value === '') {
            errs.push('<li>Ссылка не указана</li>')
        }
        if (errs.length !== 0) {
            modalMsg('Ошибка', 'Форма заполнена неправильно<ul>' + errs.join('') + '</ul>')
            return
        }

        if (uid === null) return

        posts.push({
            title: inpAddTitle.value,
            author: uid,
            url: inpAddUrl.value,
            favBy: new Set()
        })

        render()

        inpAddTitle.value = ''
        inpAddUrl.value = ''
    })

    inpSearch.addEventListener('input', render)

    mdl.addEventListener('click', (ev) => {if (ev.target === mdl) modalHide()})

    btnMdlCardDelete.addEventListener('click', () => {
        const idx = posts.indexOf(selectedPost!)
        posts.splice(idx, 1)
        modalHide()
        render()
    })

    btnMdlCardFav.addEventListener('click', () => {
        if (uid === null) return
        const fav = selectedPost!.favBy
        if (fav.has(uid)) fav.delete(uid)
        else fav.add(uid)

        modalCard(selectedPost!)
        render()
    })

    render()

})()
