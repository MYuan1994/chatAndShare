const EventEmitter = require('events');
class MyPeerConnection extends window.RTCPeerConnection{

    constructor(recvDom) {
        super()
        // this.onicecandidate = (e)=> {
        //     this.ownCandidate= e.candidate;
        // }
        this.onaddstream = function (e) {
            console.log('sssssss')
            this.peer.emit('add-stream', e.stream,recvDom);
        }

        const peer = new EventEmitter();
        peer.on('add-stream', (stream, DesktopDom) => {
            DesktopDom.srcObject = stream;
            DesktopDom.onloadedmetadata = () => {
                DesktopDom.play();
            }
        })
        this.peer=peer;
    }

    async createOfferSDP(){
        let offer=await this.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
        });
        await this.setLocalDescription(offer)
        return await this.localDescription;
    }

    async setRemote(answer) {
        await this.setRemoteDescription(answer)
    }
}

module.exports=MyPeerConnection;