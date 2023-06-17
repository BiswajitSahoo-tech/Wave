import axios from "axios"
export var peer;
export const markOffline = async ()=>{
    try{
        const res = await axios( {
            method: 'PATCH',
            url: '/api/v1/users/active',
            data: {
                active:false
            }
           })

           
           if( res.data.status === 'success'){
                console.log( res.data.data)
           }else{
            console.log(res.data)
           }
    }
    catch( err){
        console.log( err)
    }
}
export const registerPeer= (Id,peerId)=> {
    
        
        peer = new Peer(peerId)
        peer.on('open', async (id)=>{
            console.log(id)
            //API CALL TO MARK ONLINE
            try{
                const res = await axios( {
                    method: 'PATCH',
                    url: '/api/v1/users/active',
                    data: {
                        active:true
                    }
                   })
        
                   
                   if( res.data.status === 'success'){
                        console.log( res.data.data)
                   }else{
                    console.log(res.data)
                   }
                   
            } catch( err){
                console.log(err)
                
            }
        })

        peer.on('connection', (dataCon)=> {
    
                // console.log('here')
                dataCon.on('data',async  (data)=>{
                    if( data === 'intiate'){
                        // console.log(data)
                        if( confirm(dataCon.peer+' want to connect with you ?')){
                            dataCon.send('yes')
                            // charcter= 'receiver'
                        }else{
                            dataCon.send('no')
                        }
                            
                    }
                    else if(data.startsWith('done')){
                        const connId = data.split(',')[1]
                        
                        //API CALL
                        try{
                            const res = await axios( {
                                method: 'PATCH',
                                url: '/api/v1/connection/'+connId,
                                data: {
                                    receiverId: Id,
                                }
                            })
                    
                            
                            if( res.data.status === 'success'){
                                    console.log( res.data)
                                    try{
                                        const _res = await axios({
                                            method: 'PATCH',
                                            url: '/api/v1/users/recentContact',
                                            data: {
                                                contact: res.data.data.connection.callerId,
                                            }
                                        })

                                        const __res = await axios({
                                            method: 'PATCH',
                                            url: '/api/v1/users/busy',
                                            data: {
                                                busy: true
                                            }
                                        })

                                        if( _res.data.status === 'success' && __res.data.status === 'success'){
                                            dataCon.send('done,'+connId+','+Id)
                                            //DO A REDIRECT TO THE WORKSPACE
                                            window.setTimeout( ()=>{
                                                location.assign('/workspace/'+res.data.data.connection._id)
                                            } , 1500) 
                                        }else{
                                            console.log( _res.data, __res.data)
                                        }
                                    }catch(err){
                                        console.log( err)
                                    }

                                    
                            }
                            else{
                                console.log( res.data)
                            }
                            
                        } catch( err){
                            console.log(err)
                            
                        }
                    }
                })
            
            
        })
    
}

export const connect= async (Id,callerPeerId,receiverPeerId)=> {
    console.log('connect called')
    try{
        const res = await axios( {
            method: 'GET',
            url: '/api/v1/users/active/'+receiverPeerId,
            
           })

           
           if( res.data.status === 'success'){
                console.log( res.data.data)
                if( res.data.data.active === false){
                    alert(receiverPeerId+' is not online at this moment.')
                    return ;
                }
           }
           else if(res.data.status === 'fail'){
                console.log( res.data.data)
                
                alert('No user with this id: '+receiverPeerId)
                return ;
                
           }
           else{
            console.log(res.data)
           }

    }catch( err){
        console.log(err)
    }
    try{
        const res = await axios( {
            method: 'GET',
            url: '/api/v1/users/busy/'+receiverPeerId,
            
           })

           
           if( res.data.status === 'success'){
                console.log( res.data.data)
                if( res.data.data.active === true){
                    alert(receiverPeerId+' is busy at this moment.')
                    return ;
                }
           }
           
           else{
            console.log(res.data)
           }

    }catch( err){
        console.log(err)
    }

    let initConnection = peer.connect(receiverPeerId)
    
    setTimeout(()=>{
        initConnection.send('intiate')
        console.log('intiate sent')
    }, 5000)
    
    initConnection.on('data',async function(data){
        console.log(  data)
        
        if(data === 'yes'){
            
            // charcter= 'sender'
            //API CALL
            try{
                console.log('hereee...')
                const res = await axios( {
                    method: 'POST',
                    url: '/api/v1/connection/',
                    data: {
                        callerId: Id,
                        callerPeerId: callerPeerId,
                        receiverPeerId: receiverPeerId,
                        
                    }
                   })

                   if( res.data.status === 'success'){
                        console.log( res.data)
                        //SEND META_DATA
                        initConnection.send('done,'+res.data.data.connection._id)
                        //WAIT FOR DONE FROM OTHER 
                        
                   }
                   else{
                        console.log( res.data)
                   }
                   
            } catch( err){
                console.log(err)
                    
            }
                               
        }else if( data === 'no'){
            initConnection.close()
            alert('HE/SHE refuse to connect, try any one other.')

        }else if(data.startsWith('done')){
            const connId = data.split(',')[1]
            const contact = data.split(',')[2]
            console.log( data, connId," ", contact)
            //API CALL

            try{
                const _res = await axios({
                    method: 'PATCH',
                    url: '/api/v1/users/recentContact',
                    data: {
                        contact
                    }
                })
                const __res = await axios({
                    method: 'PATCH',
                    url: '/api/v1/users/busy',
                    data: {
                        busy: true
                    }
                })
                if( _res.data.status === 'success' && __res.data.status === 'success'){
                    // dataCon.send('done,'+connId)
                    //DO A REDIRECT TO THE WORKSPACE
                    window.setTimeout( ()=>{
                        location.assign('/workspace/'+connId)
                    } , 1500) 
                }else{
                    console.log( _res.data, __res.data)
                }
            }catch(err){
                console.log( err)
            }
            // window.setTimeout( ()=>{
            //     location.assign('/workspace/'+connId)
            // } , 1500)
        }
    })
 
}