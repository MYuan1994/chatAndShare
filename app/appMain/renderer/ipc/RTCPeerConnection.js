const EventEmitter = require('events');
class MyPeerConnection extends window.RTCPeerConnection{

    constructor(recvDom) {
        super()
        this.onicecandidate = function (e) {
            // console.log(JSON.stringify(e.candidate))
        }
        this.onaddstream = function (e) {
            peer.emit('add-stream', e.stream,recvDom);
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
        return await offer;
    }

    async setRemote(answer) {
        await this.setRemoteDescription(answer)
    }
}

module.exports=MyPeerConnection;