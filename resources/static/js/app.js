
window.addEventListener('load', () => {
    document.addEventListener('pointerup', e => {
        console.log('pointerup')
        const artImg = (
            e.target.classList.contains('art-img') ? e.target :
                e.target.parentElement?.classList.contains('art-img') ? e.target.parentElement :
                    undefined
        )

        if (artImg) {
            if (artImg.classList.contains('selected')) {
                artImg.classList.remove('selected')
                console.log(artImg.dataset)
                artImg.querySelector('img').src = artImg.dataset.smallpath
            } else {
                for (const img of document.querySelectorAll('.art-img')) {
                    img.classList.remove('selected')
                    img.querySelector('img').src = img.dataset.smallpath
                }

                artImg.querySelector('img').src = artImg.dataset.largepath
                artImg.classList.add('selected')
            }
        }
    })
})