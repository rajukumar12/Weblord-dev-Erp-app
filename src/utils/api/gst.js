import { del, get, post, put,} from "utils/HttpUtil"
// GST 
// Get gst
export const getGST = async () => {
    try {
        const url = `${process.env.REACT_APP_BASEURL}/gst_percent`;
        const json = await get(url);
        if (json) {
            return json
        }
    } catch (error) {
        console.log("Error with getGST: ", error);
    }
}
// Create gst
export const createGST = async (name, percent) => {
    try {
        const url = `${process.env.REACT_APP_BASEURL}/gst_percent`;
        const json = await post(url, {
            name,
            percent
        });
        if (json) {
            return json
        }
    } catch (error) {
        console.log("Error with createGST: ", error);
    }
}
// update gst
export const updateGST = async (id, name, percent) => {
    try {
        const url = `${process.env.REACT_APP_BASEURL}/gst_percent/${id}?name=${name}&percent=${percent}`;
        const json = await put(url, {
            name,
            percent
        });
        console.log(json, 'update json')
        if (json) {
            return json
        }
    } catch (error) {
        console.log("Error with updateGST: ", error);
    }
}

// delete gst
export const deleteGst = async (id) => {
    try {
        const url = `${process.env.REACT_APP_BASEURL}/gst_percent/${id}`;
        const json = await del(url, {
            id
        });
        console.log(json, "delete json")
        if (json) {
            return json
        }
    } catch (error) {
        console.log("Error with deleteGst: ", error);
    }
}