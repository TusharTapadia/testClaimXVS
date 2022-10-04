import React, { useState } from "react"
import CreateModalContext from "./CreateModalContext"

const CreateModalState = ({ children }) => {
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [createModalPortfolioName, setCreateModalPortfolioName] = useState(null)
    const [successOrErrorModalInf, setSuccessOrErrorModalInf] = useState({
        show: false,
        portfolioName: "",
        transactionType: "",
        amount: "",
        txHash: "",
        status: 0,
    })
    const [progressModalInf, setProgressModalInf] = useState({
        show: false,
        transactionType: "",
        asset1Name: "",
        asset1Amount: "",
        asset2Name: "",
        asset2Amount: ""
    })


    function toggleCreateModal(btnRef) {
        setShowCreateModal((prevState) => !prevState)

        if(btnRef) {
            const portfolioName = btnRef.getAttribute('data-portfolio-name')
            setCreateModalPortfolioName(portfolioName)
        }
    }

    const state = {
        createModalPortfolioName, 
        showCreateModal,
        toggleCreateModal,
        progressModalInf,
        setProgressModalInf,
        successOrErrorModalInf,
        setSuccessOrErrorModalInf
    }

    return (
        <CreateModalContext.Provider value={state}>
            {children}
        </CreateModalContext.Provider>
    )
}

export default CreateModalState
