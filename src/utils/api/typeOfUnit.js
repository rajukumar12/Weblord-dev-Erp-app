import { del, get, post, put,} from "utils/HttpUtil"
// UnitType 
// Get  type of unit
export const getUnitType = async () => {
    try {
        const url = `${process.env.REACT_APP_BASEURL}/type_of_unit`;
        const json = await get(url);
        if (json) {
            return json
        }
    } catch (error) {
        console.log("Error with getUnitType: ", error);
    }
}
// Create  type of unit
export const createUnitType = async (name, detail) => {
    try {
        const url = `${process.env.REACT_APP_BASEURL}/type_of_unit`;
        const json = await post(url, {
            name,
            detail
        });
        if (json) {
            return json
        }
    } catch (error) {
        console.log("Error with createUnitType: ", error);
    }
}
// update  type of unit
export const updateUnitType = async (id, name, detail) => {
    try {
        const url = `${process.env.REACT_APP_BASEURL}/type_of_unit/${id}?name=${name}&detail=${detail}`;
        const json = await put(url, {
            name,
            detail
        });
        if (json) {
            return json
        }
    } catch (error) {
        console.log("Error with updateUnitType: ", error);
    }
}

// delete  type of unit
export const deleteUnitTypet = async (id) => {
    try {
        const url = `${process.env.REACT_APP_BASEURL}/type_of_unit/${id}`;
        const json = await del(url, {
            id
        });
        console.log(json, "delete json")
        if (json) {
            return json
        }
    } catch (error) {
        console.log("Error with deleteUnitType: ", error);
    }
}