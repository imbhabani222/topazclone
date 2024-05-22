import jwtDecode from "jwt-decode";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const checkForValidToken = () => {
    const token = cookies.get("elToken");

    if (token) {
        const decodedToken = jwtDecode(token);
        const dateNow = new Date();

        if (decodedToken.exp < dateNow.getTime()) {
            return true;
        }
    }

    return false;
};

export const checkNumbervalue = (event) => {
    if (!/^[0-9]*\.?[0-9]*$/.test(event.key) && event.key !== "Backspace") {
        return true;
    }
};

export const checkSpecialCharacter = (event) => {
    if (!/^[A-Za-z0-9 ]+$/.test(event.key) && event.key !== "Backspace") {
        return true;
    }
};

export const checkSpace = (event) => {
    if (!/^\S+$/.test(event.key) && event.key !== "Backspace") {
        return true;
    }
};

export const checkAlphabets = (event) => {
    if (!/^[a-zA-Z ]*$/.test(event.key) && event.key !== "Backspace") {
        return true;
    }
};

export const checkDash = (event) => {
    if (
        !/^[a-z0-9 A-Z0-9]*-?[a-z0-9 A-Z0-9]*$/.test(event.key) &&
        event.key !== "Backspace"
    ) {
        return true;
    }
};

export const checkForSetOfStrings = (str, matchingStr) => {
    if (typeof matchingStr === "object") {
        return matchingStr.some((el) => str.includes(el));
    } else if (typeof matchingStr === "string") {
        return str.includes(matchingStr);
    }

    return false;
};

export const isNull = (e) => {
    return e ? e + ", " : "";
};

export const isBlank = (e) => {
    return e || "";
};

export const multipleTenValidator = (name = "Value", _, value) => {
    if (value % 10 === 0) {
        return Promise.resolve();
    } else {
        return Promise.reject(new Error(`${name} should be multiple of 10`));
    }
};
