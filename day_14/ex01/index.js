export default async function main() {
    console.log('start app')
    
    let currentIndex = 0
    const menuitems = document.querySelectorAll(".menu-item")

    console.log(menuitems)

    menuitems[currentIndex].classList.add("select")/*.찍으면 지정해 주는 것/list를 불러올 때는 대괄호 사용 */

    window.addEventListener("keydown", (e) => {
        console.log(e.key)

        menuitems[currentIndex].classList.remove('select')

        if (e.key == "ArrowUp") {
            currentIndex--

            if(currentIndex < 0)
                currentIndex = 3
        }
        else if (e.key == "ArrowDown") {
            currentIndex ++
            currentIndex %= 4
        }
        console.log(currentIndex)
        menuitems[currentIndex].classList.add('select')
    })



}