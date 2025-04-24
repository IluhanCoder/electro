import ReactDatePicker from "react-datepicker";
import { inputStyle } from "../styles/form-styles";

interface LocalParams {
    startDate: Date,
    endDate: Date
    handleStart: (date: Date | null) => void,
    handleEnd: (date: Date | null) => void,
    className?: string
}

function DatePicker ({handleStart, startDate, endDate, handleEnd, className}: LocalParams) {
    return <div className={className}>
          <div className="flex gap-2">
              <label className="mt-1">Від:</label>
              <ReactDatePicker
                dateFormat="dd/MM/yyyy"
                className={inputStyle}
                selected={startDate}
                onChange={handleStart}
                locale={"ua"}
              />
            </div>
            <div className="flex gap-2">
              <label className="mt-1">До:</label>
              <ReactDatePicker
                dateFormat="dd/MM/yyyy"
                className={inputStyle}
                selected={endDate}
                onChange={handleEnd}
                locale={"ua"}
              />
            </div>
    </div>
}

export default DatePicker;