// "use client";

// import { useState, useEffect, useMemo } from "react";
// import type React from "react";
// import { gql, useQuery, useMutation } from "@apollo/client";
// import useTranslation from "@/hooks/useTranslation";
// import moment from "moment";
// import { Dialog } from "@headlessui/react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Plus,
//   X,
// } from "lucide-react";

// /**
//  * A weekly calendar view for managing staff shifts.  This component
//  * displays a grid of seven days (Monday through Sunday) with hourly
//  * increments along the vertical axis.  Shifts are rendered as
//  * coloured blocks within their corresponding day, sized and
//  * positioned according to their start and end times.  Users can
//  * navigate between weeks, add new shifts or edit existing ones via
//  * modal dialogs.  All data is fetched and persisted via GraphQL
//  * queries and mutations.
//  */
// export default function SalonSchedule() {
//   const { t } = useTranslation();
//   // Session state: determines which salon (business) the schedule belongs to
//   const [businessId, setBusinessId] = useState<string | null>(null);
//   const [businessType, setBusinessType] = useState<string | null>(null);
//   const [sessionLoading, setSessionLoading] = useState(true);
//   const [sessionError, setSessionError] = useState<string | null>(null);

//   // Calendar state: the start of the currently displayed ISO week
//   const [weekStart, setWeekStart] = useState(() => moment().startOf("isoWeek"));

//   // Modal state for creating/editing a shift
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
//   const [modalDate, setModalDate] = useState<Date | null>(null);
//   const [modalStartTime, setModalStartTime] = useState<string>("08:00");
//   const [modalEndTime, setModalEndTime] = useState<string>("14:00");
//   const [modalStaffId, setModalStaffId] = useState<string>("");
//   const [modalNotes, setModalNotes] = useState<string>("");

//   // Fetch the user session to obtain business context
//   useEffect(() => {
//     async function fetchSession() {
//       try {
//         const res = await fetch("/api/session");
//         if (!res.ok) throw new Error("Failed to load session");
//         const data = await res.json();
//         if (
//           data.businessType &&
//           data.businessType.toLowerCase() === "salon" &&
//           data.businessId
//         ) {
//           setBusinessId(data.businessId);
//           setBusinessType(data.businessType.toLowerCase());
//         } else {
//           setSessionError("You are not associated with a salon business.");
//         }
//       } catch (err: any) {
//         setSessionError(err.message || "Failed to load session");
//       } finally {
//         setSessionLoading(false);
//       }
//     }
//     fetchSession();
//   }, []);

//   // GraphQL definitions
//   const GET_STAFF = gql`
//     query GetStaff($businessId: ID!, $businessType: String!) {
//       staff(businessId: $businessId, businessType: $businessType) {
//         id
//         name
//         role
//       }
//     }
//   `;
//   const GET_SHIFTS = gql`
//     query GetShifts($businessId: ID!, $businessType: String!, $startDate: Date!, $endDate: Date!) {
//       shifts(businessId: $businessId, businessType: $businessType, startDate: $startDate, endDate: $endDate) {
//         id
//         staffId {
//           id
//           name
//           role
//         }
//         date
//         startTime
//         endTime
//         notes
//       }
//     }
//   `;
//   const CREATE_SHIFT = gql`
//     mutation CreateShift($input: ShiftInput!) {
//       createShift(input: $input) {
//         id
//       }
//     }
//   `;
//   const UPDATE_SHIFT = gql`
//     mutation UpdateShift($id: ID!, $input: ShiftInput!) {
//       updateShift(id: $id, input: $input) {
//         id
//       }
//     }
//   `;
//   const DELETE_SHIFT = gql`
//     mutation DeleteShift($id: ID!) {
//       deleteShift(id: $id)
//     }
//   `;

//   // Execute queries
//   const {
//     data: staffData,
//     loading: staffLoading,
//     error: staffError,
//   } = useQuery(GET_STAFF, {
//     variables: { businessId, businessType },
//     skip: !businessId || !businessType,
//   });
//   // Compute start/end of current week for shift query variables
//   const weekStartDate = useMemo(() => weekStart.clone().startOf("day"), [weekStart]);
//   const weekEndDate = useMemo(() => weekStart.clone().add(6, "day").endOf("day"), [weekStart]);
//   const {
//     data: shiftsData,
//     loading: shiftsLoading,
//     error: shiftsError,
//     refetch: refetchShifts,
//   } = useQuery(GET_SHIFTS, {
//     variables: {
//       businessId,
//       businessType,
//       startDate: weekStartDate.toDate(),
//       endDate: weekEndDate.toDate(),
//     },
//     skip: !businessId || !businessType,
//   });

//   // Mutations
//   const [createShift] = useMutation(CREATE_SHIFT, {
//     onCompleted: () => refetchShifts(),
//   });
//   const [updateShift] = useMutation(UPDATE_SHIFT, {
//     onCompleted: () => refetchShifts(),
//   });
//   const [deleteShift] = useMutation(DELETE_SHIFT, {
//     onCompleted: () => refetchShifts(),
//   });

//   // Derived lists
//   const staff = staffData?.staff || [];
//   const shifts = shiftsData?.shifts || [];

//   // Maintain a list of selected staff IDs for filtering.  When no
//   // staff are selected we default to showing all.  Upon initial
//   // loading of the staff list we select all staff by default so
//   // that all shifts are displayed.  Users can toggle individual
//   // staff to customise which shifts appear on the calendar.
//   const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
//   useEffect(() => {
//     if (staff && staff.length > 0) {
//       setSelectedStaffIds(staff.map((s: any) => s.id));
//     }
//   }, [staff]);
//   const toggleStaffSelection = (id: string) => {
//     setSelectedStaffIds((prev) => {
//       if (prev.includes(id)) {
//         return prev.filter((s) => s !== id);
//       }
//       return [...prev, id];
//     });
//   };

//   // Filter shifts based on selected staff.  When no selection is
//   // present (i.e. the selection array is empty) we default to
//   // showing all shifts.  This memoised value recomputes only when
//   // either the shifts list or the selected staff changes.
//   const visibleShifts = useMemo(() => {
//     if (!selectedStaffIds || selectedStaffIds.length === 0) return shifts;
//     return shifts.filter((shift: any) => {
//       const sid = shift.staffId?.id;
//       return sid ? selectedStaffIds.includes(sid) : true;
//     });
//   }, [shifts, selectedStaffIds]);

//   // Compute array of seven days for the calendar header
//   const weekDays = useMemo(() => {
//     return Array.from({ length: 7 }, (_, i) => weekStart.clone().add(i, "day"));
//   }, [weekStart]);

//   // Times for the left axis (24 hours)
//   const times = useMemo(() => {
//     return Array.from({ length: 24 }, (_, i) => {
//       const hour = i.toString().padStart(2, "0");
//       return `${hour}:00`;
//     });
//   }, []);

//   // Utility: generate a deterministic colour based on staff name
//   function colourForName(name: string) {
//     const colours = ["#EC4899", "#F59E0B", "#10B981", "#8B5CF6", "#06B6D4", "#F43F5E"];
//     let hash = 0;
//     for (let i = 0; i < name.length; i++) {
//       hash = name.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     return colours[Math.abs(hash) % colours.length];
//   }

//   // Determine the top offset and height for a shift block given start and end times
//   const rowHeight = 40; // height in px per hour
//   function getOffset(start: string) {
//     const [h, m] = start.split(":").map((x) => parseInt(x));
//     return ((h * 60 + m) / 60) * rowHeight;
//   }
//   function getHeight(start: string, end: string) {
//     const [sh, sm] = start.split(":").map((x) => parseInt(x));
//     const [eh, em] = end.split(":").map((x) => parseInt(x));
//     const startMinutes = sh * 60 + sm;
//     const endMinutes = eh * 60 + em;
//     const diff = Math.max(endMinutes - startMinutes, 30); // minimum 30 minutes height
//     return (diff / 60) * rowHeight;
//   }

//   // Estimated height of the sticky day header (px).  Used when
//   // computing selection offsets relative to the time grid.
//   const headerHeight = 40;

//   // Compute layout information for overlapping shifts.  For each day,
//   // assign a column index to every shift and derive a left offset and
//   // width percentage.  Shifts are sorted by start time.  Columns
//   // represent parallel tracks; if a shift can fit into an existing
//   // column (no overlap), it uses that column.  Otherwise a new
//   // column is created.  All shifts on a given day share the same
//   // column count, so narrower events may leave some empty space when
//   // concurrency varies.  The resulting layout is stored in a map
//   // keyed by shift ID.
//   const layoutMap = useMemo(() => {
//     const map: Record<string, { leftPercent: number; widthPercent: number }> = {};
//     weekDays.forEach((day) => {
//       const dayStr = day.format("YYYY-MM-DD");
//       const dayEvents = visibleShifts
//         .filter((shift: any) => moment(shift.date).format("YYYY-MM-DD") === dayStr)
//         .map((shift: any) => {
//           const [sh, sm] = shift.startTime.split(":").map((x: string) => parseInt(x));
//           const [eh, em] = shift.endTime.split(":").map((x: string) => parseInt(x));
//           const startMinutes = sh * 60 + sm;
//           const endMinutes = eh * 60 + em;
//           return { ...shift, startMinutes, endMinutes };
//         })
//         .sort((a: any, b: any) => a.startMinutes - b.startMinutes);
//       // Assign columns
//       const columns: number[] = [];
//       dayEvents.forEach((event: any) => {
//         let assigned = false;
//         for (let i = 0; i < columns.length; i++) {
//           if (event.startMinutes >= columns[i]) {
//             event.columnIndex = i;
//             columns[i] = event.endMinutes;
//             assigned = true;
//             break;
//           }
//         }
//         if (!assigned) {
//           event.columnIndex = columns.length;
//           columns.push(event.endMinutes);
//         }
//       });
//       const colCount = columns.length || 1;
//       dayEvents.forEach((event: any) => {
//         const width = 100 / colCount;
//         const left = event.columnIndex * width;
//         map[event.id] = { leftPercent: left, widthPercent: width };
//       });
//     });
//     return map;
//   }, [visibleShifts, weekDays]);

//   // Selection state for click‑and‑drag range selection
//   const [isSelecting, setIsSelecting] = useState(false);
//   const [selectionDay, setSelectionDay] = useState<string | null>(null);
//   const [selectionStartY, setSelectionStartY] = useState<number | null>(null);
//   const [selectionCurrentY, setSelectionCurrentY] = useState<number | null>(null);

//   // Convert a vertical offset (in px) into a HH:mm time string.
//   function offsetToTime(offset: number): string {
//     const minutes = (offset / rowHeight) * 60;
//     let h = Math.floor(minutes / 60);
//     let m = Math.round((minutes % 60) / 15) * 15;
//     if (m === 60) {
//       h += 1;
//       m = 0;
//     }
//     h = Math.min(Math.max(h, 0), 23);
//     m = Math.min(Math.max(m, 0), 59);
//     const pad = (n: number) => n.toString().padStart(2, '0');
//     return `${pad(h)}:${pad(m)}`;
//   }

//   // Open the add shift modal with explicit start and end times
//   const openAddModal = (date: Date, startTime: string, endTime: string) => {
//     setEditingShiftId(null);
//     setModalDate(date);
//     setModalStartTime(startTime);
//     setModalEndTime(endTime);
//     setModalStaffId(staff.length > 0 ? staff[0].id : '');
//     setModalNotes('');
//     setIsModalOpen(true);
//   };

//   // Open modal for new shift on a specific day.  If an offset in pixels is
//   // provided (e.g. from a double‑click event), we derive the start time
//   // from the vertical position within the column.  The end time is
//   // defaulted to two hours after the start.
//   const handleAddShift = (date: Date, offsetY?: number) => {
//     setEditingShiftId(null);
//     setModalDate(date);
//     let start = "08:00";
//     let end = "14:00";
//     if (typeof offsetY === "number") {
//       const totalMinutes = (offsetY / rowHeight) * 60;
//       const h = Math.floor(totalMinutes / 60);
//       const m = Math.round(totalMinutes % 60 / 15) * 15; // snap to nearest 15 min
//       const pad = (n: number) => n.toString().padStart(2, "0");
//       start = `${pad(h)}:${pad(m)}`;
//       // default duration: 2 hours
//       let endMinutes = h * 60 + m + 120;
//       const endH = Math.floor(endMinutes / 60) % 24;
//       const endM = endMinutes % 60;
//       end = `${pad(endH)}:${pad(endM)}`;
//     }
//     setModalStartTime(start);
//     setModalEndTime(end);
//     setModalStaffId(staff.length > 0 ? staff[0].id : "");
//     setModalNotes("");
//     setIsModalOpen(true);
//   };

//   // Open modal to edit an existing shift
//   const handleEditShift = (shift: any) => {
//     setEditingShiftId(shift.id);
//     setModalDate(new Date(shift.date));
//     setModalStartTime(shift.startTime);
//     setModalEndTime(shift.endTime);
//     setModalStaffId(shift.staffId?.id || "");
//     setModalNotes(shift.notes || "");
//     setIsModalOpen(true);
//   };

//   // Save shift (create or update)
//   const handleSaveShift = async () => {
//     if (!businessId || !businessType || !modalDate || !modalStaffId) {
//       setIsModalOpen(false);
//       return;
//     }
//     const input = {
//       businessId,
//       businessType,
//       staffId: modalStaffId,
//       date: modalDate.toISOString(),
//       startTime: modalStartTime,
//       endTime: modalEndTime,
//       notes: modalNotes || null,
//     } as any;
//     try {
//       if (editingShiftId) {
//         await updateShift({ variables: { id: editingShiftId, input } });
//       } else {
//         await createShift({ variables: { input } });
//       }
//     } catch (err) {
//       console.error("Failed to save shift", err);
//     } finally {
//       setIsModalOpen(false);
//     }
//   };

//   // Delete shift
//   const handleDeleteShift = async () => {
//     if (editingShiftId) {
//       try {
//         await deleteShift({ variables: { id: editingShiftId } });
//       } catch (err) {
//         console.error("Failed to delete shift", err);
//       } finally {
//         setIsModalOpen(false);
//       }
//     }
//   };

//   // Navigation
//   const goPrevWeek = () => {
//     setWeekStart((prev) => prev.clone().subtract(1, "week"));
//   };
//   const goNextWeek = () => {
//     setWeekStart((prev) => prev.clone().add(1, "week"));
//   };

//   if (sessionLoading) {
//     return <div>{t("loading") || "Loading..."}</div>;
//   }
//   if (sessionError) {
//     return <div className="text-red-500">{t("failedToLoadSession") || sessionError}</div>;
//   }
//   if (staffLoading || shiftsLoading) {
//     return <div>{t("loading") || "Loading..."}</div>;
//   }
//   if (staffError || shiftsError) {
//     return <div className="text-red-500">{t("failedToLoadData") || "Failed to load data."}</div>;
//   }

//   return (
//     <div className="space-y-4">
//       {/* Header with navigation */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">{t("staffSchedule") || "Staff Schedule"}</h1>
//           <p className="text-gray-600">
//             {weekStart.format("D MMM") + " - " + weekStart.clone().add(6, "day").format("D MMM YYYY")}
//           </p>
//         </div>
//         <div className="flex space-x-2">
//           <button
//             type="button"
//             onClick={goPrevWeek}
//             className="p-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
//           >
//             <ChevronLeft className="h-5 w-5" />
//           </button>
//           <button
//             type="button"
//             onClick={goNextWeek}
//             className="p-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
//           >
//             <ChevronRight className="h-5 w-5" />
//           </button>
//           <button
//             type="button"
//             onClick={() => handleAddShift(weekStart.toDate())}
//             className="flex items-center px-3 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             {t("addShift") || "Add Shift"}
//           </button>
//         </div>
//       </div>

//       {/* Staff filter checkboxes.  When multiple staff are available,
//           display a list of checkboxes allowing the user to choose
//           which personnel to display on the calendar.  The default
//           selection is all staff. */}
//       {staff && staff.length > 0 && (
//         <div className="flex flex-wrap items-center gap-4">
//           {staff.map((member: any) => (
//             <label key={member.id} className="inline-flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 checked={selectedStaffIds.includes(member.id)}
//                 onChange={() => toggleStaffSelection(member.id)}
//                 className="form-checkbox rounded text-pink-600"
//               />
//               <span className="text-sm text-gray-700">{member.name}</span>
//             </label>
//           ))}
//         </div>
//       )}
//       {/* Calendar grid */}
//       <div className="overflow-x-auto">
//         <div className="grid" style={{ gridTemplateColumns: `80px repeat(7, 1fr)` }}>
//           {/* Times column */}
//           <div className="border-b border-gray-200" style={{ height: rowHeight * 24 }}>
//             {times.map((tVal, idx) => (
//               <div
//                 key={idx}
//                 className="h-10 border-t border-gray-200 text-xs text-gray-500 flex items-start justify-start pl-1"
//                 style={{ height: rowHeight }}
//               >
//                 {tVal}
//               </div>
//             ))}
//           </div>
//           {/* Day columns */}
//           {weekDays.map((day, dayIndex) => {
//             // Filter shifts for this day based on the selected staff.  Only
//             // visibleShifts are considered so that the calendar reflects
//             // the current staff filter.
//             const dayDateStr = day.format("YYYY-MM-DD");
//             const dayShifts = visibleShifts.filter((shift: any) => {
//               return moment(shift.date).format("YYYY-MM-DD") === dayDateStr;
//             });
//             return (
//               <div
//                 key={dayIndex}
//                 className="border-l border-gray-200 relative"
//                 style={{ height: rowHeight * 24 }}
//                 onMouseDown={(e) => {
//                   const offsetY = (e.nativeEvent as any).offsetY - headerHeight;
//                   if (offsetY < 0 || offsetY > rowHeight * 24) return;
//                   const dayStr = day.format("YYYY-MM-DD");
//                   setIsSelecting(true);
//                   setSelectionDay(dayStr);
//                   setSelectionStartY(offsetY);
//                   setSelectionCurrentY(offsetY);
//                 }}
//                 onMouseMove={(e) => {
//                   if (!isSelecting) return;
//                   if (selectionDay !== day.format("YYYY-MM-DD")) return;
//                   const offsetY = (e.nativeEvent as any).offsetY - headerHeight;
//                   setSelectionCurrentY(offsetY);
//                 }}
//                 onMouseUp={(e) => {
//                   if (!isSelecting) return;
//                   if (selectionDay !== day.format("YYYY-MM-DD")) return;
//                   const offsetY = (e.nativeEvent as any).offsetY - headerHeight;
//                   let sY = selectionStartY ?? 0;
//                   let eY = offsetY;
//                   let startY = Math.min(sY, eY);
//                   let endY = Math.max(sY, eY);
//                   // Clamp to grid bounds
//                   startY = Math.max(0, Math.min(startY, rowHeight * 24));
//                   endY = Math.max(0, Math.min(endY, rowHeight * 24));
//                   let startTimeStr = offsetToTime(startY);
//                   let endTimeStr = offsetToTime(endY);
//                   // Ensure end is after start; if equal, default to 1 hour
//                   if (startTimeStr === endTimeStr) {
//                     const [sh, sm] = startTimeStr.split(":").map((x) => parseInt(x));
//                     let endMinutes = sh * 60 + sm + 60;
//                     const endH = Math.floor(endMinutes / 60) % 24;
//                     const endM = endMinutes % 60;
//                     const pad = (n: number) => n.toString().padStart(2, '0');
//                     endTimeStr = `${pad(endH)}:${pad(endM)}`;
//                   }
//                   openAddModal(day.toDate(), startTimeStr, endTimeStr);
//                   // Reset selection state
//                   setIsSelecting(false);
//                   setSelectionDay(null);
//                   setSelectionStartY(null);
//                   setSelectionCurrentY(null);
//                 }}
//               >
//                 {/* Day header */}
//                 <div className="sticky top-0 bg-white z-10 text-center py-1 border-b border-gray-200">
//                   <div className="text-sm font-semibold text-gray-700">
//                     {day.format("ddd")}
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     {day.format("D/M")}
//                   </div>
//                 </div>
//                 {/* Selection highlight */}
//                 {isSelecting && selectionDay === day.format("YYYY-MM-DD") &&
//                   selectionStartY !== null &&
//                   selectionCurrentY !== null && (
//                     (() => {
//                       const sY = selectionStartY as number;
//                       const cY = selectionCurrentY as number;
//                       const top = headerHeight + Math.min(sY, cY);
//                       const height = Math.abs(cY - sY);
//                       return (
//                         <div
//                           className="absolute inset-x-0 bg-pink-300 bg-opacity-40 pointer-events-none"
//                           style={{ top, height }}
//                         />
//                       );
//                     })()
//                   )}
//                 {/* Shift blocks */}
//                 {dayShifts.map((shift: any) => {
//                   const top = getOffset(shift.startTime);
//                   const height = getHeight(shift.startTime, shift.endTime);
//                   const staffName = shift.staffId?.name || "";
//                   const colour = colourForName(staffName);
//                   const layout = layoutMap[shift.id] || { leftPercent: 0, widthPercent: 100 };
//                   const style: React.CSSProperties = {
//                     top,
//                     height,
//                     left: `${layout.leftPercent}%`,
//                     width: `calc(${layout.widthPercent}% - 4px)`,
//                     backgroundColor: colour,
//                   };
//                   return (
//                     <div
//                       key={shift.id}
//                       onClick={() => handleEditShift(shift)}
//                       className="absolute p-1 rounded-md text-xs text-white shadow cursor-pointer"
//                       style={style}
//                     >
//                       <div className="font-semibold truncate">{staffName}</div>
//                       <div className="text-[10px]">
//                         {shift.startTime} - {shift.endTime}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//       {/* Modal for add/edit shift */}
//       <Dialog
//         open={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         as="div"
//         className="fixed inset-0 z-50 overflow-y-auto"
//       >
//         <div className="flex min-h-screen items-center justify-center p-4 text-center">
//           {/* Overlay */}
//           <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
//           {/* Panel */}
//           <Dialog.Panel className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
//             <div className="flex justify-between items-center mb-4">
//               <Dialog.Title className="text-lg font-medium text-gray-900">
//                 {editingShiftId
//                   ? t("editShift") || "Edit Shift"
//                   : t("addShift") || "Add Shift"}
//               </Dialog.Title>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
//             <div className="space-y-4 text-left">
//               {/* Date */}
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-1">
//                   {t("dateLabelColumn") || "Date"}
//                 </label>
//                 <input
//                   type="date"
//                   value={modalDate ? moment(modalDate).format("YYYY-MM-DD") : ""}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     setModalDate(value ? new Date(value) : null);
//                   }}
//                   className="border border-gray-300 rounded-md p-2"
//                 />
//               </div>
//               {/* Staff selection */}
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-1">
//                   {t("staffLabel") || "Staff"}
//                 </label>
//                 <select
//                   value={modalStaffId}
//                   onChange={(e) => setModalStaffId(e.target.value)}
//                   className="border border-gray-300 rounded-md p-2"
//                 >
//                   {staff.map((s: any) => (
//                     <option key={s.id} value={s.id}>
//                       {s.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               {/* Start time */}
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-1">
//                   {t("startTime") || "Start Time"}
//                 </label>
//                 <input
//                   type="time"
//                   value={modalStartTime}
//                   onChange={(e) => setModalStartTime(e.target.value)}
//                   className="border border-gray-300 rounded-md p-2"
//                 />
//               </div>
//               {/* End time */}
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-1">
//                   {t("endTime") || "End Time"}
//                 </label>
//                 <input
//                   type="time"
//                   value={modalEndTime}
//                   onChange={(e) => setModalEndTime(e.target.value)}
//                   className="border border-gray-300 rounded-md p-2"
//                 />
//               </div>
//               {/* Notes */}
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-1">
//                   {t("notes") || "Notes"}
//                 </label>
//                 <textarea
//                   value={modalNotes}
//                   onChange={(e) => setModalNotes(e.target.value)}
//                   className="border border-gray-300 rounded-md p-2"
//                 />
//               </div>
//               <div className="flex justify-end space-x-2 pt-2">
//                 {editingShiftId && (
//                   <button
//                     type="button"
//                     onClick={handleDeleteShift}
//                     className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//                   >
//                     {t("delete") || "Delete"}
//                   </button>
//                 )}
//                 <button
//                   type="button"
//                   onClick={handleSaveShift}
//                   className="px-3 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
//                 >
//                   {t("save") || "Save"}
//                 </button>
//               </div>
//             </div>
//           </Dialog.Panel>
//         </div>
//       </Dialog>
//     </div>
//   );
// }





// test1




"use client"

import { useState, useEffect, useMemo } from "react"
import type React from "react"
import { gql, useQuery, useMutation } from "@apollo/client"
import useTranslation from "@/hooks/useTranslation"
import moment from "moment"
import { Dialog } from "@headlessui/react"
import { ChevronLeft, ChevronRight, Plus, X, Calendar, Clock, User, FileText } from "lucide-react"

/**
 * A weekly calendar view for managing staff shifts.  This component
 * displays a grid of seven days (Monday through Sunday) with hourly
 * increments along the vertical axis.  Shifts are rendered as
 * coloured blocks within their corresponding day, sized and
 * positioned according to their start and end times.  Users can
 * navigate between weeks, add new shifts or edit existing ones via
 * modal dialogs.  All data is fetched and persisted via GraphQL
 * queries and mutations.
 */
export default function SalonSchedule() {
  const { t } = useTranslation()
  // Session state: determines which salon (business) the schedule belongs to
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [businessType, setBusinessType] = useState<string | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [sessionError, setSessionError] = useState<string | null>(null)

  // Calendar state: the start of the currently displayed ISO week
  const [weekStart, setWeekStart] = useState(() => moment().startOf("isoWeek"))

  // Modal state for creating/editing a shift
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null)
  const [modalDate, setModalDate] = useState<Date | null>(null)
  const [modalStartTime, setModalStartTime] = useState<string>("08:00")
  const [modalEndTime, setModalEndTime] = useState<string>("14:00")
  const [modalStaffId, setModalStaffId] = useState<string>("")
  const [modalNotes, setModalNotes] = useState<string>("")

  // Fetch the user session to obtain business context
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/session")
        if (!res.ok) throw new Error("Failed to load session")
        const data = await res.json()
        if (data.businessType && data.businessType.toLowerCase() === "salon" && data.businessId) {
          setBusinessId(data.businessId)
          setBusinessType(data.businessType.toLowerCase())
        } else {
          setSessionError("You are not associated with a salon business.")
        }
      } catch (err: any) {
        setSessionError(err.message || "Failed to load session")
      } finally {
        setSessionLoading(false)
      }
    }
    fetchSession()
  }, [])

  // GraphQL definitions
  const GET_STAFF = gql`
    query GetStaff($businessId: ID!, $businessType: String!) {
      staff(businessId: $businessId, businessType: $businessType) {
        id
        name
        role
      }
    }
  `
  const GET_SHIFTS = gql`
    query GetShifts($businessId: ID!, $businessType: String!, $startDate: Date!, $endDate: Date!) {
      shifts(businessId: $businessId, businessType: $businessType, startDate: $startDate, endDate: $endDate) {
        id
        staffId {
          id
          name
          role
        }
        date
        startTime
        endTime
        notes
      }
    }
  `
  const CREATE_SHIFT = gql`
    mutation CreateShift($input: ShiftInput!) {
      createShift(input: $input) {
        id
      }
    }
  `
  const UPDATE_SHIFT = gql`
    mutation UpdateShift($id: ID!, $input: ShiftInput!) {
      updateShift(id: $id, input: $input) {
        id
      }
    }
  `
  const DELETE_SHIFT = gql`
    mutation DeleteShift($id: ID!) {
      deleteShift(id: $id)
    }
  `

  // Execute queries
  const {
    data: staffData,
    loading: staffLoading,
    error: staffError,
  } = useQuery(GET_STAFF, {
    variables: { businessId, businessType },
    skip: !businessId || !businessType,
  })
  // Compute start/end of current week for shift query variables
  const weekStartDate = useMemo(() => weekStart.clone().startOf("day"), [weekStart])
  const weekEndDate = useMemo(() => weekStart.clone().add(6, "day").endOf("day"), [weekStart])
  const {
    data: shiftsData,
    loading: shiftsLoading,
    error: shiftsError,
    refetch: refetchShifts,
  } = useQuery(GET_SHIFTS, {
    variables: {
      businessId,
      businessType,
      startDate: weekStartDate.toDate(),
      endDate: weekEndDate.toDate(),
    },
    skip: !businessId || !businessType,
  })

  // Mutations
  const [createShift] = useMutation(CREATE_SHIFT, {
    onCompleted: () => refetchShifts(),
  })
  const [updateShift] = useMutation(UPDATE_SHIFT, {
    onCompleted: () => refetchShifts(),
  })
  const [deleteShift] = useMutation(DELETE_SHIFT, {
    onCompleted: () => refetchShifts(),
  })

  // Derived lists
  const staff = staffData?.staff || []
  const shifts = shiftsData?.shifts || []

  // Maintain a list of selected staff IDs for filtering.  When no
  // staff are selected we default to showing all.  Upon initial
  // loading of the staff list we select all staff by default so
  // that all shifts are displayed.  Users can toggle individual
  // staff to customise which shifts appear on the calendar.
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([])
  useEffect(() => {
    if (staff && staff.length > 0) {
      setSelectedStaffIds(staff.map((s: any) => s.id))
    }
  }, [staff])
  const toggleStaffSelection = (id: string) => {
    setSelectedStaffIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((s) => s !== id)
      }
      return [...prev, id]
    })
  }

  // Filter shifts based on selected staff.  When no selection is
  // present (i.e. the selection array is empty) we default to
  // showing all shifts.  This memoised value recomputes only when
  // either the shifts list or the selected staff changes.
  const visibleShifts = useMemo(() => {
    if (!selectedStaffIds || selectedStaffIds.length === 0) return shifts
    return shifts.filter((shift: any) => {
      const sid = shift.staffId?.id
      return sid ? selectedStaffIds.includes(sid) : true
    })
  }, [shifts, selectedStaffIds])

  // Compute array of seven days for the calendar header
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => weekStart.clone().add(i, "day"))
  }, [weekStart])

  // Times for the left axis (24 hours)
  const times = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, "0")
      return `${hour}:00`
    })
  }, [])

  // Utility: generate a deterministic colour based on staff name
  function colourForName(name: string) {
    const colours = [
      "#3B82F6", // Blue
      "#10B981", // Emerald
      "#F59E0B", // Amber
      "#EF4444", // Red
      "#8B5CF6", // Violet
      "#06B6D4", // Cyan
      "#F97316", // Orange
      "#84CC16", // Lime
      "#EC4899", // Pink
      "#6366F1", // Indigo
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colours[Math.abs(hash) % colours.length]
  }

  // Determine the top offset and height for a shift block given start and end times
  const rowHeight = 48 // Increased height for better readability
  function getOffset(start: string) {
    const [h, m] = start.split(":").map((x) => Number.parseInt(x))
    return ((h * 60 + m) / 60) * rowHeight
  }
  function getHeight(start: string, end: string) {
    const [sh, sm] = start.split(":").map((x) => Number.parseInt(x))
    const [eh, em] = end.split(":").map((x) => Number.parseInt(x))
    const startMinutes = sh * 60 + sm
    const endMinutes = eh * 60 + em
    const diff = Math.max(endMinutes - startMinutes, 30) // minimum 30 minutes height
    return (diff / 60) * rowHeight
  }

  // Estimated height of the sticky day header (px).  Used when
  // computing selection offsets relative to the time grid.
  const headerHeight = 56 // Adjusted for new header height

  // Compute layout information for overlapping shifts.  For each day,
  // assign a column index to every shift and derive a left offset and
  // width percentage.  Shifts are sorted by start time.  Columns
  // represent parallel tracks; if a shift can fit into an existing
  // column (no overlap), it uses that column.  Otherwise a new
  // column is created.  All shifts on a given day share the same
  // column count, so narrower events may leave some empty space when
  // concurrency varies.  The resulting layout is stored in a map
  // keyed by shift ID.
  const layoutMap = useMemo(() => {
    const map: Record<string, { leftPercent: number; widthPercent: number }> = {}
    weekDays.forEach((day) => {
      const dayStr = day.format("YYYY-MM-DD")
      const dayEvents = visibleShifts
        .filter((shift: any) => moment(shift.date).format("YYYY-MM-DD") === dayStr)
        .map((shift: any) => {
          const [sh, sm] = shift.startTime.split(":").map((x: string) => Number.parseInt(x))
          const [eh, em] = shift.endTime.split(":").map((x: string) => Number.parseInt(x))
          const startMinutes = sh * 60 + sm
          const endMinutes = eh * 60 + em
          return { ...shift, startMinutes, endMinutes }
        })
        .sort((a: any, b: any) => a.startMinutes - b.startMinutes)
      // Assign columns
      const columns: number[] = []
      dayEvents.forEach((event: any) => {
        let assigned = false
        for (let i = 0; i < columns.length; i++) {
          if (event.startMinutes >= columns[i]) {
            event.columnIndex = i
            columns[i] = event.endMinutes
            assigned = true
            break
          }
        }
        if (!assigned) {
          event.columnIndex = columns.length
          columns.push(event.endMinutes)
        }
      })
      const colCount = columns.length || 1
      dayEvents.forEach((event: any) => {
        const width = 100 / colCount
        const left = event.columnIndex * width
        map[event.id] = { leftPercent: left, widthPercent: width }
      })
    })
    return map
  }, [visibleShifts, weekDays])

  // Selection state for click‑and‑drag range selection
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionDay, setSelectionDay] = useState<string | null>(null)
  const [selectionStartY, setSelectionStartY] = useState<number | null>(null)
  const [selectionCurrentY, setSelectionCurrentY] = useState<number | null>(null)

  // Convert a vertical offset (in px) into a HH:mm time string.
  function offsetToTime(offset: number): string {
    const minutes = (offset / rowHeight) * 60
    let h = Math.floor(minutes / 60)
    let m = Math.round((minutes % 60) / 15) * 15
    if (m === 60) {
      h += 1
      m = 0
    }
    h = Math.min(Math.max(h, 0), 23)
    m = Math.min(Math.max(m, 0), 59)
    const pad = (n: number) => n.toString().padStart(2, "0")
    return `${pad(h)}:${pad(m)}`
  }

  // Open the add shift modal with explicit start and end times
  const openAddModal = (date: Date, startTime: string, endTime: string) => {
    setEditingShiftId(null)
    setModalDate(date)
    setModalStartTime(startTime)
    setModalEndTime(endTime)
    setModalStaffId(staff.length > 0 ? staff[0].id : "")
    setModalNotes("")
    setIsModalOpen(true)
  }

  // Open modal for new shift on a specific day.  If an offset in pixels is
  // provided (e.g. from a double‑click event), we derive the start time
  // from the vertical position within the column.  The end time is
  // defaulted to two hours after the start.
  const handleAddShift = (date: Date, offsetY?: number) => {
    setEditingShiftId(null)
    setModalDate(date)
    let start = "08:00"
    let end = "14:00"
    if (typeof offsetY === "number") {
      const totalMinutes = (offsetY / rowHeight) * 60
      const h = Math.floor(totalMinutes / 60)
      const m = Math.round((totalMinutes % 60) / 15) * 15 // snap to nearest 15 min
      const pad = (n: number) => n.toString().padStart(2, "0")
      start = `${pad(h)}:${pad(m)}`
      // default duration: 2 hours
      const endMinutes = h * 60 + m + 120
      const endH = Math.floor(endMinutes / 60) % 24
      const endM = endMinutes % 60
      end = `${pad(endH)}:${pad(endM)}`
    }
    setModalStartTime(start)
    setModalEndTime(end)
    setModalStaffId(staff.length > 0 ? staff[0].id : "")
    setModalNotes("")
    setIsModalOpen(true)
  }

  // Open modal to edit an existing shift
  const handleEditShift = (shift: any) => {
    setEditingShiftId(shift.id)
    setModalDate(new Date(shift.date))
    setModalStartTime(shift.startTime)
    setModalEndTime(shift.endTime)
    setModalStaffId(shift.staffId?.id || "")
    setModalNotes(shift.notes || "")
    setIsModalOpen(true)
  }

  // Save shift (create or update)
  const handleSaveShift = async () => {
    if (!businessId || !businessType || !modalDate || !modalStaffId) {
      setIsModalOpen(false)
      return
    }
    const input = {
      businessId,
      businessType,
      staffId: modalStaffId,
      date: modalDate.toISOString(),
      startTime: modalStartTime,
      endTime: modalEndTime,
      notes: modalNotes || null,
    } as any
    try {
      if (editingShiftId) {
        await updateShift({ variables: { id: editingShiftId, input } })
      } else {
        await createShift({ variables: { input } })
      }
    } catch (err) {
      console.error("Failed to save shift", err)
    } finally {
      setIsModalOpen(false)
    }
  }

  // Delete shift
  const handleDeleteShift = async () => {
    if (editingShiftId) {
      try {
        await deleteShift({ variables: { id: editingShiftId } })
      } catch (err) {
        console.error("Failed to delete shift", err)
      } finally {
        setIsModalOpen(false)
      }
    }
  }

  // Navigation
  const goPrevWeek = () => {
    setWeekStart((prev) => prev.clone().subtract(1, "week"))
  }
  const goNextWeek = () => {
    setWeekStart((prev) => prev.clone().add(1, "week"))
  }

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">{t("loading") || "Loading..."}</span>
      </div>
    )
  }
  if (sessionError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">{t("failedToLoadSession") || sessionError}</div>
      </div>
    )
  }
  if (staffLoading || shiftsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">{t("loading") || "Loading..."}</span>
      </div>
    )
  }
  if (staffError || shiftsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">{t("failedToLoadData") || "Failed to load data."}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("staffSchedule") || "Staff Schedule"}</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {weekStart.format("D MMM") + " - " + weekStart.clone().add(6, "day").format("D MMM YYYY")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={goPrevWeek}
                  className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={goNextWeek}
                  className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleAddShift(weekStart.toDate())}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t("addShift") || "Add Shift"}</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>

        {staff && staff.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Staff Filter
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStaffIds(staff.map((s: any) => s.id))}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Select All
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={() => setSelectedStaffIds([])}
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium transition-colors duration-200"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {staff.map((member: any) => {
                const isSelected = selectedStaffIds.includes(member.id)
                const staffColor = colourForName(member.name)

                return (
                  <div
                    key={member.id}
                    onClick={() => toggleStaffSelection(member.id)}
                    className={`relative group cursor-pointer rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                      isSelected
                        ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            isSelected ? "bg-blue-600 shadow-sm" : "bg-gray-300"
                          }`}
                          style={{ backgroundColor: isSelected ? staffColor : undefined }}
                        />
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300 group-hover:border-blue-400"
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4
                          className={`font-semibold text-sm transition-colors duration-200 ${
                            isSelected ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
                          }`}
                        >
                          {member.name}
                        </h4>
                        {member.role && (
                          <p
                            className={`text-xs transition-colors duration-200 ${
                              isSelected ? "text-blue-700" : "text-gray-500 group-hover:text-gray-600"
                            }`}
                          >
                            {member.role}
                          </p>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <div
                        className="absolute inset-0 rounded-xl opacity-10 pointer-events-none"
                        style={{ backgroundColor: staffColor }}
                      />
                    )}

                    {isSelected && (
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                        style={{ backgroundColor: staffColor }}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {selectedStaffIds.length === 0
                    ? "No staff selected - showing all shifts"
                    : `${selectedStaffIds.length} of ${staff.length} staff selected`}
                </span>
                {selectedStaffIds.length > 0 && selectedStaffIds.length < staff.length && (
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {selectedStaffIds.slice(0, 3).map((staffId) => {
                        const staffMember = staff.find((s: any) => s.id === staffId)
                        if (!staffMember) return null
                        return (
                          <div
                            key={staffId}
                            className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
                            style={{ backgroundColor: colourForName(staffMember.name) }}
                            title={staffMember.name}
                          >
                            {staffMember.name.charAt(0).toUpperCase()}
                          </div>
                        )
                      })}
                      {selectedStaffIds.length > 3 && (
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-400 flex items-center justify-center text-xs font-medium text-white">
                          +{selectedStaffIds.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid" style={{ gridTemplateColumns: `100px repeat(7, 1fr)` }}>
                <div className="bg-gray-50 border-r border-gray-200" style={{ height: rowHeight * 24 }}>
                  {times.map((tVal, idx) => (
                    <div
                      key={idx}
                      className="h-12 border-t border-gray-100 text-xs text-gray-500 flex items-start justify-center pt-1 font-medium"
                      style={{ height: rowHeight }}
                    >
                      {tVal}
                    </div>
                  ))}
                </div>
                {weekDays.map((day, dayIndex) => {
                  const dayDateStr = day.format("YYYY-MM-DD")
                  const dayShifts = visibleShifts.filter((shift: any) => {
                    return moment(shift.date).format("YYYY-MM-DD") === dayDateStr
                  })
                  const isToday = day.isSame(moment(), "day")
                  return (
                    <div
                      key={dayIndex}
                      className={`border-l border-gray-200 relative hover:bg-gray-50/50 transition-colors duration-200 ${
                        isToday ? "bg-blue-50/30" : ""
                      }`}
                      style={{ height: rowHeight * 24 }}
                      onMouseDown={(e) => {
                        const offsetY = (e.nativeEvent as any).offsetY - headerHeight
                        if (offsetY < 0 || offsetY > rowHeight * 24) return
                        const dayStr = day.format("YYYY-MM-DD")
                        setIsSelecting(true)
                        setSelectionDay(dayStr)
                        setSelectionStartY(offsetY)
                        setSelectionCurrentY(offsetY)
                      }}
                      onMouseMove={(e) => {
                        if (!isSelecting) return
                        if (selectionDay !== day.format("YYYY-MM-DD")) return
                        const offsetY = (e.nativeEvent as any).offsetY - headerHeight
                        setSelectionCurrentY(offsetY)
                      }}
                      onMouseUp={(e) => {
                        if (!isSelecting) return
                        if (selectionDay !== day.format("YYYY-MM-DD")) return
                        const offsetY = (e.nativeEvent as any).offsetY - headerHeight
                        const sY = selectionStartY ?? 0
                        const eY = offsetY
                        let startY = Math.min(sY, eY)
                        let endY = Math.max(sY, eY)
                        startY = Math.max(0, Math.min(startY, rowHeight * 24))
                        endY = Math.max(0, Math.min(endY, rowHeight * 24))
                        const startTimeStr = offsetToTime(startY)
                        let endTimeStr = offsetToTime(endY)
                        if (startTimeStr === endTimeStr) {
                          const [sh, sm] = startTimeStr.split(":").map((x) => Number.parseInt(x))
                          const endMinutes = sh * 60 + sm + 60
                          const endH = Math.floor(endMinutes / 60) % 24
                          const endM = endMinutes % 60
                          const pad = (n: number) => n.toString().padStart(2, "0")
                          endTimeStr = `${pad(endH)}:${pad(endM)}`
                        }
                        openAddModal(day.toDate(), startTimeStr, endTimeStr)
                        setIsSelecting(false)
                        setSelectionDay(null)
                        setSelectionStartY(null)
                        setSelectionCurrentY(null)
                      }}
                    >
                      <div
                        className={`sticky top-0 z-10 text-center py-3 border-b border-gray-200 ${
                          isToday ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                        }`}
                      >
                        <div className="text-sm font-semibold">{day.format("ddd")}</div>
                        <div className={`text-xs ${isToday ? "text-blue-100" : "text-gray-500"}`}>
                          {day.format("D/M")}
                        </div>
                      </div>
                      {/* Selection highlight */}
                      {isSelecting &&
                        selectionDay === day.format("YYYY-MM-DD") &&
                        selectionStartY !== null &&
                        selectionCurrentY !== null &&
                        (() => {
                          const sY = selectionStartY as number
                          const cY = selectionCurrentY as number
                          const top = headerHeight + Math.min(sY, cY)
                          const height = Math.abs(cY - sY)
                          return (
                            <div
                              className="absolute inset-x-0 bg-blue-200 bg-opacity-50 pointer-events-none border-2 border-blue-400 border-dashed"
                              style={{ top, height }}
                            />
                          )
                        })()}
                      {dayShifts.map((shift: any) => {
                        const top = getOffset(shift.startTime)
                        const height = getHeight(shift.startTime, shift.endTime)
                        const staffName = shift.staffId?.name || ""
                        const colour = colourForName(staffName)
                        const layout = layoutMap[shift.id] || { leftPercent: 0, widthPercent: 100 }
                        const style: React.CSSProperties = {
                          top,
                          height,
                          left: `${layout.leftPercent}%`,
                          width: `calc(${layout.widthPercent}% - 6px)`,
                          backgroundColor: colour,
                        }
                        return (
                          <div
                            key={shift.id}
                            onClick={() => handleEditShift(shift)}
                            className="absolute p-2 rounded-lg text-xs text-white shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 hover:scale-105 border border-white/20"
                            style={style}
                          >
                            <div className="font-semibold truncate text-sm">{staffName}</div>
                            <div className="text-xs opacity-90 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {shift.startTime} - {shift.endTime}
                            </div>
                            {shift.notes && <div className="text-xs opacity-75 truncate mt-1">{shift.notes}</div>}
                          </div>
                        )
                      })}
                      {/* Hour grid lines */}
                      {times.map((_, idx) => (
                        <div
                          key={idx}
                          className="absolute inset-x-0 border-t border-gray-100"
                          style={{ top: headerHeight + idx * rowHeight }}
                        />
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex min-h-screen items-center justify-center p-4 text-center">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <Dialog.Panel className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                {editingShiftId ? t("editShift") || "Edit Shift" : t("addShift") || "Add Shift"}
              </Dialog.Title>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-5 text-left">
              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t("dateLabelColumn") || "Date"}
                </label>
                <input
                  type="date"
                  value={modalDate ? moment(modalDate).format("YYYY-MM-DD") : ""}
                  onChange={(e) => {
                    const value = e.target.value
                    setModalDate(value ? new Date(value) : null)
                  }}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
              {/* Staff selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t("staffLabel") || "Staff"}
                </label>
                <select
                  value={modalStaffId}
                  onChange={(e) => setModalStaffId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  {staff.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Time inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t("startTime") || "Start Time"}
                  </label>
                  <input
                    type="time"
                    value={modalStartTime}
                    onChange={(e) => setModalStartTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t("endTime") || "End Time"}
                  </label>
                  <input
                    type="time"
                    value={modalEndTime}
                    onChange={(e) => setModalEndTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
              </div>
              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t("notes") || "Notes"}
                </label>
                <textarea
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                  placeholder="Add any additional notes..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                {editingShiftId && (
                  <button
                    type="button"
                    onClick={handleDeleteShift}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                  >
                    {t("delete") || "Delete"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSaveShift}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  {t("save") || "Save"}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}
