import React, { createContext, useState, useContext } from "react";
import privateAxios from "../api/privateAxios";

const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
    const [boards, setBoards] = useState([]);

    // Gọi API để lấy danh sách bảng ngay sau khi đăng nhập
    const getAllBoardsByUserId = async () => {
        try {
            const response = await privateAxios.post(
                "/board/getBoardsByUserId",
                {
                    checkMessage: "Get boards by user id"
                }
            );
            const data = await response.data;
            setBoards(data.data);
            return;
        } catch (error) {
            console.log(error);
            return;
        }
    };

    // Gọi API tạo bảng mới đợi xác nhận success thì thêm id bảng
    // mới trả về vào object rồi add vào boards rồi show ra
    const createBoard = async ({ boardTitle, boardDescription, boardType }) => {
        const newBoard = {
            _id: null,
            board_title: boardTitle,
            board_description: boardDescription,
            board_is_public: boardType,
            board_collaborators: [],
            board_list: [],
            create_at: ""
        };
        try {
            const response = await privateAxios.post("board/createBoard", {
                checkMessage: "Create new board",
                board_title: boardTitle,
                board_description: boardDescription,
                board_is_public: boardType,
                board_collaborators: [],
                board_list: []
            });
            const data = await response.data;
            newBoard._id = data.data;
            newBoard.create_at = Date.now();
            setBoards([...boards, newBoard]);
            return "Success";
        } catch (error) {
            console.log(error);
        }
    };


    //mei
    //update board
    const updateBoard = async (boardId, newTitle) => {
        try {
            const response = await privateAxios.post("/board/updateBoard", {
                checkMessage: "Update board",
                board_id: boardId,
                board_update_details: { board_title: newTitle },
            });

            const data = await response.data;

            if (data.success) {
                setBoards((prevBoards) =>
                    prevBoards.map((board) =>
                        board._id === boardId ? { ...board, board_title: newTitle } : board
                    )
                );
                return "Success";
            } else {
                console.log("Update failed:", data.message);
                return "Failed";
            }
        } catch (error) {
            console.log("Error updating board:", error);
            return "Error";
        }
    };

    //delete board
    const deleteBoard = async (boardId) => {
        try {
            const response = await privateAxios.post("/board/deleteBoard", {
                checkMessage: "Delete board",
                board_id: boardId,
            });

            const data = await response.data;

            if (data.success) {
                setBoards((prevBoards) => prevBoards.filter(board => board._id !== boardId));
                return "Success";
            } else {
                console.log("Delete failed:", data.message);
                return "Failed";
            }
        } catch (error) {
            console.log("Error deleting board:", error);
            return "Error";
        }
    };

    //end-mei

    return (
        <BoardContext.Provider value={{ boards, getAllBoardsByUserId, createBoard, updateBoard, deleteBoard }}>

            {children}
        </BoardContext.Provider>

    );
};

export const useBoard = () => {
    return useContext(BoardContext);
};
