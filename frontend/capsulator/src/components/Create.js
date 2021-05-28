import { useEffect, useState } from "react"
import classname from 'classnames'
import { useDispatch, useSelector } from "react-redux"

import { createCapsule, selectCapsules, selectCapsulesStatus, selectCapsulesIds } from "../store/capsulesSlice"
import { fetchProfile, selectProfile } from "../store/profileSlice"
import { useHistory } from "react-router"


function CreationVerificationModal({capsuleURL}) {
    const [copied, setCopied] = useState("Copy")
    const history = useHistory()

    function handleRedirect(){
        history.push("/dashboard")
    }

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-primary bg-opacity-70 m-4">
            {/* The Modal */}
            <div className="text-secondary bg-primary w-128 h-80 rounded-2xl p-6 flex flex-col shadow-xl border-seondary border-2 space-y-2"> 
                {/* Success Message */}
                <div className="flex justify-center items-center felx-grow">    
                {/* Add icon here */}
                    <h1 className="text-2xl font-bold md:text-3xl md:font-extrabold text-secondary text-center">Your Time Capsule is ready!</h1>
                </div>
                <div className="flex-grow flex justify-center items-end">
                    <p className="text-secondary text-xs md:text-lg">Share memories with friends:</p>
                </div>
                {/* Share Link */}
                <div className="flex justify-center items-center flex-grow ">
                    <div className="text-secondary text-sm font-bold md:text-bold md:text-xl flex flex-grow justify-center items-center rounded-l-2xl h-full w-5/6 border-secondary border-2 rounder-l-2xl overflow-hidden">
                        <div className="overflow-x-auto h-full flex items-center justify-center">

                            <p className="w-full whitespace-pre select-all">{capsuleURL}</p>
                        </div>
                    </div>
                    <button 
                        className="bg-secondary text-primary text-sm font-bold md:text-bold md:text-xl outline-none flex-grow w-1/6 h-full rounded-r-2xl" 
                        type="text"
                        onClick={() => {navigator.clipboard.writeText(capsuleURL); setCopied("Copied!");}}
                    >{copied}</button>
                </div>

                {/* Redirection button */}
                <div className="flex justify-center items-center flex-grow">
                    <button 
                        className="bg-secondary text-primary text-sm font-bold md:text-bold md:text-xl outline-none flex-grow w-full h-full rounded-2xl " 
                        type="text"
                        onClick={handleRedirect}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}

function Create() {
    const [shareButton, setShareButton] = useState(0)
    const [publicButton, setPublicButton] = useState(0)
    const [name, setName] = useState("")
    const [unlockDate, setUnlockDate] = useState("")
    
    const [created, setCreated] = useState(0)
    
    const [modalCapsuleURL, setModalCapsuleURL] = useState(null)
    const [modalIsReady, setModalIsReady] = useState(false)

    const capsules = useSelector(selectCapsules)
    const capsulesIds = useSelector(selectCapsulesIds)
    const capsulesStatus = useSelector(selectCapsulesStatus)


    useEffect(
        // Get the created capsule
        () => {
            if (capsulesStatus !== 'pending' && created){
                // The created capsule is the last one in the ids list 
                const capsuleURL = `http://localhost:8000/${capsules[capsulesIds[capsulesIds.length - 1]].key}`;
                setModalCapsuleURL(capsuleURL)
            }
        }, [capsules])

    useEffect(() => {
        // Render the modal
        if (modalCapsuleURL){
            setModalIsReady(1)
        }

    }, [modalCapsuleURL])

    const profile = useSelector(selectProfile)

    const dispatch = useDispatch()

    function handleCreateCapsule(){
        if (name && unlockDate && profile){
            dispatch(createCapsule({name: name, unlockDate: unlockDate, member: profile.id, public: publicButton}))
            setCreated(1)
        }   
    }

    return (
        <div>
            { modalIsReady && <CreationVerificationModal capsuleURL={modalCapsuleURL} /> }
            <div className="bg-secondary h-128 rounded-b-2xl p-4 ">
                <div className="flex flex-col space-y-2">
                    {/* Create Capsule */}
                    <div className="flex justify-center items-center felx-grow">    
                            <h1 className="text-2xl font-bold md:text-3xl md:font-extrabold text-primary">Create a Time Capsule</h1>
                    </div>
                    {/* Choose Name */}
                    <div className="flex justify-center items-center felx-grow h-16">
                        <div className="text-primary text-sm font-bold md:text-bold md:text-xl flex flex-grow justify-center items-center rounded-l-2xl h-full w-2/6 border-primary border-2 rounder-l-2xl">
                            <p>Name</p>
                        </div>
                        <input 
                            className="bg-primary text-secondary text-sm font-bold md:text-bold md:text-xl outline-none flex-grow w-4/6 h-full rounded-r-2xl" 
                            type="text"
                            onChange={(e) => {setName(e.target.value)}}
                            />
                    </div>
                    {/* Choose unlock date */}
                    <div className="flex justify-center items-center felx-grow h-16">
                        <div className="text-primary text-sm font-bold md:text-bold md:text-xl flex flex-grow justify-center items-center rounded-l-2xl h-full w-2/6 border-primary border-2 rounder-l-2xl">
                            <p>Unlock Date</p>
                        </div>
                        <input 
                            className="bg-primary text-secondary text-sm font-bold md:text-bold md:text-xl outline-none flex-grow w-4/6 h-full rounded-r-2xl" 
                            type="date"
                            onChange={(e) => {setUnlockDate(e.target.value)}}
                            />
                    </div>
                    {/* Choose share & make public */}
                    <div className="flex justify-center items-start felx-grow flex-col space-y-2">
                        <div className="flex-grow flex justify-center items-center"> 
                            <button 
                                className="flex-grow flex justify-center items-center space-x-2"
                                onClick={() => setShareButton(!shareButton)}
                                >
        
                                <button className={classname("border-2 border-primary h-6 w-6 rounded-lg", {"bg-primary": shareButton, "bg-secondary": !shareButton})}></button>
                                <p className="text-primary text-xs font-semibold md:text-bold md:text-xl">Shareable with friends</p>

                            </button>
                        </div>

                        <div className="flex-grow flex justify-center items-center">
                            <button className="flex-grow flex justify-center items-center space-x-2"
                                onClick={() => setPublicButton(!publicButton)} 
                                >
                                <button className={classname("border-2 border-primary h-6 w-6 rounded-lg", {"bg-primary": publicButton, "bg-secondary": !publicButton})}></button>
                                <p className="text-primary text-xs font-semibold md:text-bold md:text-xl">Viewable for public</p>
                            </button>
                        </div>
                    </div>

                    {/* Create Button */}
                    <div className="flex flex-col flex-grow w-full items-center justify-center h-16">
                        <button 
                            className="rounded-md bg-primary text-secondary w-full h-full font-bold text-2xl"
                            onClick={handleCreateCapsule} 
                            >Create</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Create
