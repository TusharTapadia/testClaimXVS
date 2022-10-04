function formatDecimal(num) {
    if (num) {
        num = num.toString()
        let newNum = ""
        const len = num.length
        for (let i = 0; i < len; i++) {
            if (num.charAt(i) !== ".") {
                newNum += num.charAt(i)
            } else if (num.charAt(i) === ".") {
                newNum += num.charAt(i) + num.charAt(i + 1) + num.charAt(i + 2) + num.charAt(i + 3)
                break
            }
        }
        return newNum
    }
    return undefined
}

export default formatDecimal
