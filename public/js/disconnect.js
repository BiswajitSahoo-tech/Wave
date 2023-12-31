import axios from "axios"
export const disconnect = async (connId)=>{
    try{
        const res = await axios({
            method:'DELETE',
            url:'/api/v1/connection/'+connId
        })
        if( res.data.status === 'success'){
            window.setTimeout( ()=>{
                location.assign('/')
            } , 1500)
        }
    }catch( err){
        console.log( err)
    }
    
}
export const markBusy = async ()=> {
    try{
        const __res = await axios({
            method: 'PATCH',
            url: '/api/v1/users/busy',
            data: {
                busy: false
            }
        })
    }catch( err){
        console.log( err);
    }
}