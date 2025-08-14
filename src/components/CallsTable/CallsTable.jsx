import React, { useState, useEffect } from "react";
import { getCalls, getCallRecord } from "~/lib/api/skillaApi";
import { ratingConfig } from "~/lib/consts/ratingConfig";
import { RatingCard } from "~/components/RatingCard/RatingCard";
import { IconButton } from "../../lib/ui/IconButton/IconButton";
import { CallStatusIcon } from "../CallStatusIcon/CallStatusIcon";

export const CallsTable = () => {
    const [calls, setCalls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dateStart, setDateStart] = useState("2025-08-10");
    const [dateEnd, setDateEnd] = useState("2025-08-14");
    const [inOut, setInOut] = useState(""); // "" - все, 1 - входящие, 0 - исходящие
    const [sortBy, setSortBy] = useState("date");
    const [order, setOrder] = useState("DESC");
    const [audio, setAudio] = useState(null);


    useEffect(() => {
        loadCalls();
    }, [dateStart, dateEnd, inOut, sortBy, order]);

    const loadCalls = async () => {
        setLoading(true);
        try {
            const data = await getCalls({
                date_start: dateStart,
                date_end: dateEnd,
                in_out: inOut,
                sort_by: sortBy,
                order: order,
                // limit: 50
            });

            const withRatings = data.results.map(c => ({
                ...c,
                rating: ratingConfig[c.time > 0 ? Math.round(Math.random() * 4) : 4]
            }));
            console.log(withRatings);

            setCalls(withRatings)
        } catch (e) {
            console.error(e)
        }
        setLoading(false);
    }

    const playRecord = async (recordId, partnershipId) => {
        try {
            const blob = await getCallRecord(recordId, partnershipId);
            const url = URL.createObjectURL(blob);
            if (audio) audio.pause();
            const newAudio = new Audio(url);
            newAudio.play();
            setAudio(newAudio);
        } catch (e) {
            console.error("Ошибка воспроизведения:", e);
        }
    }

    return (
        <div>
            <div>
                <IconButton label={'Чек'} />
                <select value={inOut} onChange={e => setInOut(e.target.value)}>
                    <option value="">Все типы</option>
                    <option value="1">Входящие</option>
                    <option value="0">Исходящие</option>
                </select>
                <input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} />
                <input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} />
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="date">Дата</option>
                    <option value="duration">Длительность</option>
                </select>
                <select value={order} onChange={e => setOrder(e.target.value)}>
                    <option value="DESC">Убыв.</option>
                    <option value="ASC">Возр.</option>
                </select>
            </div>

            {/* Таблица */}
            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <table border="1" cellPadding="5">
                    <thead>
                        <tr>
                            <th>Тип</th>
                            <th><button>Время</button></th>
                            <th>Сотрудник</th>
                            <th>Номер</th>
                            <th>Источник</th>
                            <th>Оценка</th>
                            <th>Длительность (сек)</th>
                            <th>Запись</th>
                        </tr>
                    </thead>
                    <tbody>
                        {calls.map(call => (
                            <tr key={call.id}>
                                <td><CallStatusIcon status={call.status} in_out={call.in_out} /></td>
                                <td>{new Date(call.date).toLocaleTimeString().slice(0, 5)}</td>
                                <td><img src={call.person_avatar} /></td>
                                <td>{call.from_number || call.to_number}</td>
                                <td>{call.source || call.line_name || ""}</td>
                                <td><RatingCard rating={call.rating} /></td>
                                <td>{call.time > 0 ? call.time : ''}</td>
                                <td>
                                    {call.record ? (
                                        <button onClick={() => playRecord(call.record, call.partnership_id)}>▶</button>
                                    ) : (
                                        ""
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}