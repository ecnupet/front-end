const interact = {
    showDrugs() {
        /**
         * @type {import('../../src/api/guide-interact').DrugQueryMessage}
         */
        const message = {queryObject:'drug'}
        window.parent.postMessage(message, "*");
    },
    showChargeProject() {
        /**
         * @type {import('../../src/api/guide-interact').ChargeProjectQueryMessage}
         */
         const message = {queryObject:'charge-project'}
         window.parent.postMessage(message, "*");
    },
    /**
     * 参数是路径数组
     * @param {string[]} path 
     */
    showRoomProcess(path) {
        /**
         * @type {import('../../src/api/guide-interact').RoomProcessQueryMessage}
         */
         const message = {queryObject:'room-process', path}
         window.parent.postMessage(message, "*");
    }
}