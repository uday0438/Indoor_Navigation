/**
 * KEC Sir Visveswaraiah Block — Complete Navigation Data
 * Seed script for MongoDB
 *
 * Run: node src/data/seedData.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../../config/db');
const Location = require('../models/Location');
const Floor = require('../models/Floor');

// ──────────────────────────────────────────────
// FLOOR DEFINITIONS
// ──────────────────────────────────────────────
const floors = [
  { floorNumber: 0, name: 'Ground Floor', shortName: 'G', width: 82, height: 50, areaSqft: 19840.68, areaSqm: 1843.26 },
  { floorNumber: 1, name: 'First Floor',  shortName: '1', width: 105, height: 88, areaSqft: 36061.89, areaSqm: 3350.26 },
  { floorNumber: 2, name: 'Second Floor', shortName: '2', width: 105, height: 88, areaSqft: 35067.74, areaSqm: 3257.90 },
  { floorNumber: 3, name: 'Third Floor',  shortName: '3', width: 105, height: 92, areaSqft: 35067.74, areaSqm: 3257.90 },
];

// ──────────────────────────────────────────────
// HELPER: create bidirectional edge
// ──────────────────────────────────────────────
function edge(a, b, w) {
  return { a, b, w };
}

// ──────────────────────────────────────────────
// GROUND FLOOR (floor 0)
// ──────────────────────────────────────────────
const groundLocations = [
  // Rooms
  { locationId: 'g-sve002', name: 'SVE 002-004', floor: 0, x: 6, y: 8, type: 'room', label: 'SVE 002-004' },
  { locationId: 'g-sve005', name: 'SVE 005 & 006', floor: 0, x: 30, y: 5, type: 'room' },
  { locationId: 'g-au001',  name: 'AU 001', floor: 0, x: 47, y: 5, type: 'auditorium', label: 'Auditorium' },
  { locationId: 'g-sve007', name: 'SVE 007 & 008', floor: 0, x: 63, y: 5, type: 'room' },
  { locationId: 'g-sve001', name: 'SVE 001', floor: 0, x: 76, y: 8, type: 'room' },
  { locationId: 'g-sv004',  name: 'SV 004', floor: 0, x: 5, y: 29, type: 'room' },
  { locationId: 'g-sv003',  name: 'SV 003', floor: 0, x: 5, y: 45, type: 'room' },
  { locationId: 'g-sv001',  name: 'SV 001', floor: 0, x: 75, y: 25, type: 'room' },
  { locationId: 'g-sv002',  name: 'SV 002', floor: 0, x: 75, y: 41, type: 'room' },
  // Corridors
  { locationId: 'g-entry',  name: 'Main Entrance', floor: 0, x: 41, y: 48, type: 'entrance', label: 'Main Entrance' },
  { locationId: 'g-ct',     name: 'Corridor Top', floor: 0, x: 41, y: 10, type: 'corridor' },
  { locationId: 'g-cl',     name: 'Corridor Left', floor: 0, x: 10, y: 25, type: 'corridor' },
  { locationId: 'g-cr',     name: 'Corridor Right', floor: 0, x: 72, y: 25, type: 'corridor' },
  { locationId: 'g-cc',     name: 'Center', floor: 0, x: 41, y: 30, type: 'corridor' },
  // Stairs
  { locationId: 'g-stairs', name: 'Ground Stairs', floor: 0, x: 10, y: 43, type: 'stairs', label: 'Stairs to 1F' },
];

const groundEdges = [
  edge('g-entry', 'g-cc', 18), edge('g-cc', 'g-ct', 20),
  edge('g-cc', 'g-cl', 31), edge('g-cc', 'g-cr', 31),
  edge('g-ct', 'g-sve005', 12), edge('g-ct', 'g-au001', 8), edge('g-ct', 'g-sve007', 22),
  edge('g-ct', 'g-sve002', 31), edge('g-ct', 'g-sve001', 35),
  edge('g-cl', 'g-sv004', 6), edge('g-cl', 'g-sv003', 20), edge('g-cl', 'g-stairs', 18),
  edge('g-cr', 'g-sv001', 5), edge('g-cr', 'g-sv002', 18),
  edge('g-sv003', 'g-stairs', 5),
];

// ──────────────────────────────────────────────
// FIRST FLOOR (floor 1)
// ──────────────────────────────────────────────
const firstLocations = [
  // Left wing rooms
  { locationId: 'f1-sve106', name: 'SVE 106', floor: 1, x: 5, y: 3, type: 'room', label: 'SIMULATION LAB' },
  { locationId: 'f1-sve105', name: 'SVE 105', floor: 1, x: 5, y: 10, type: 'room', label: 'FACULTY EEE ROOM' },
  { locationId: 'f1-sve104', name: 'SVE 104', floor: 1, x: 5, y: 16, type: 'room', label: 'DOCTOR ROOM' },
  { locationId: 'f1-sv127',  name: 'SV 127', floor: 1, x: 5, y: 23, type: 'room', label: 'IV EEE' },
  { locationId: 'f1-sv126',  name: 'SV 126', floor: 1, x: 5, y: 31, type: 'room', label: 'III EEE' },
  { locationId: 'f1-sv125',  name: 'SV 125', floor: 1, x: 5, y: 37, type: 'room', label: 'EEE LIBRARY' },
  { locationId: 'f1-sv124',  name: 'SV 124', floor: 1, x: 5, y: 41, type: 'room', label: 'HOD EEE' },
  { locationId: 'f1-sv123',  name: 'SV 123', floor: 1, x: 5, y: 47, type: 'room', label: 'II EEE' },
  { locationId: 'f1-sv122',  name: 'SV 122', floor: 1, x: 5, y: 57, type: 'room', label: 'FLUIDS MECHANICS LAB' },
  { locationId: 'f1-sv121',  name: 'SV 121', floor: 1, x: 5, y: 67, type: 'room', label: 'LADIES WASHROOM' },
  { locationId: 'f1-sv120',  name: 'SV 120', floor: 1, x: 5, y: 73, type: 'room', label: 'RECORD ROOM' },
  // Bottom wing rooms
  { locationId: 'f1-sv119',  name: 'SV 119', floor: 1, x: 7, y: 81, type: 'room', label: 'SEMINAR HALL' },
  { locationId: 'f1-sv118a', name: 'SV 118 A', floor: 1, x: 19, y: 80, type: 'room', label: 'CHAIRMAN ROOM' },
  { locationId: 'f1-sv118b', name: 'SV 118 B', floor: 1, x: 24, y: 80, type: 'room', label: 'VICE CHAIRMAN ROOM' },
  { locationId: 'f1-sv117',  name: 'SV 117', floor: 1, x: 29, y: 80, type: 'room', label: 'EXAMINATION CELL' },
  { locationId: 'f1-sv116',  name: 'SV 116', floor: 1, x: 51, y: 55, type: 'office', label: 'Principal Office', metadata: { roomNumber: '116', department: 'Administration' } },
  { locationId: 'f1-sv115',  name: 'SV 115', floor: 1, x: 41, y: 78, type: 'room', label: 'PRINCIPAL ROOM' },
  { locationId: 'f1-sv114',  name: 'SV 114', floor: 1, x: 41, y: 83, type: 'office', label: 'OFFICE ROOM', metadata: { roomNumber: '114' } },
  { locationId: 'f1-sv111',  name: 'SV 111', floor: 1, x: 59, y: 80, type: 'office', label: 'Vice Principal', metadata: { roomNumber: '111' } },
  { locationId: 'f1-sv110',  name: 'SV 110', floor: 1, x: 67, y: 80, type: 'office', label: 'Admission Room', metadata: { roomNumber: '110' } },
  { locationId: 'f1-sv109',  name: 'SV 109', floor: 1, x: 75, y: 80, type: 'room' },
  { locationId: 'f1-sv108',  name: 'SV 108', floor: 1, x: 89, y: 81, type: 'room' },
  // Right wing rooms
  { locationId: 'f1-sve101', name: 'SVE 101', floor: 1, x: 98, y: 3, type: 'room' },
  { locationId: 'f1-sve102', name: 'SVE 102', floor: 1, x: 98, y: 10, type: 'room' },
  { locationId: 'f1-sve103', name: 'SVE 103', floor: 1, x: 98, y: 16, type: 'room' },
  { locationId: 'f1-sv101',  name: 'SV 101', floor: 1, x: 98, y: 23, type: 'room' },
  { locationId: 'f1-sv102',  name: 'SV 102', floor: 1, x: 98, y: 31, type: 'room' },
  { locationId: 'f1-sv103',  name: 'SV 103', floor: 1, x: 98, y: 39, type: 'room' },
  { locationId: 'f1-sv104',  name: 'SV 104', floor: 1, x: 98, y: 47, type: 'room' },
  { locationId: 'f1-sv105',  name: 'SV 105', floor: 1, x: 98, y: 59, type: 'room' },
  { locationId: 'f1-sv106',  name: 'SV 106', floor: 1, x: 97, y: 69, type: 'room' },
  { locationId: 'f1-sv107',  name: 'SV 107', floor: 1, x: 97, y: 73, type: 'room' },
  // Corridors
  { locationId: 'f1-cl1', name: 'L-Corridor Top', floor: 1, x: 11, y: 5, type: 'corridor' },
  { locationId: 'f1-cl2', name: 'L-Corridor Mid-Up', floor: 1, x: 11, y: 20, type: 'corridor' },
  { locationId: 'f1-cl3', name: 'L-Corridor Mid', floor: 1, x: 11, y: 37, type: 'corridor' },
  { locationId: 'f1-cl4', name: 'L-Corridor Mid-Low', floor: 1, x: 11, y: 55, type: 'corridor' },
  { locationId: 'f1-cl5', name: 'L-Corridor Bottom', floor: 1, x: 11, y: 68, type: 'corridor' },
  { locationId: 'f1-cr1', name: 'R-Corridor Top', floor: 1, x: 92, y: 5, type: 'corridor' },
  { locationId: 'f1-cr2', name: 'R-Corridor Mid-Up', floor: 1, x: 92, y: 20, type: 'corridor' },
  { locationId: 'f1-cr3', name: 'R-Corridor Mid', floor: 1, x: 92, y: 37, type: 'corridor' },
  { locationId: 'f1-cr4', name: 'R-Corridor Mid-Low', floor: 1, x: 92, y: 55, type: 'corridor' },
  { locationId: 'f1-cr5', name: 'R-Corridor Bottom', floor: 1, x: 92, y: 68, type: 'corridor' },
  { locationId: 'f1-jbl', name: 'Junction Bottom-Left', floor: 1, x: 11, y: 74, type: 'corridor' },
  { locationId: 'f1-jbr', name: 'Junction Bottom-Right', floor: 1, x: 92, y: 74, type: 'corridor' },
  { locationId: 'f1-cb1', name: 'Bottom Corridor 1', floor: 1, x: 20, y: 74, type: 'corridor' },
  { locationId: 'f1-cb2', name: 'Bottom Corridor 2', floor: 1, x: 40, y: 74, type: 'corridor' },
  { locationId: 'f1-cb3', name: 'Bottom Corridor 3', floor: 1, x: 60, y: 74, type: 'corridor' },
  { locationId: 'f1-cb4', name: 'Bottom Corridor 4', floor: 1, x: 80, y: 74, type: 'corridor' },
  // Stairs
  { locationId: 'f1-stairs', name: 'First Floor Stairs', floor: 1, x: 12, y: 46, type: 'stairs', label: 'Stairs' },
];

const firstEdges = [
  // Left corridor spine
  edge('f1-cl1', 'f1-cl2', 15), edge('f1-cl2', 'f1-cl3', 17),
  edge('f1-cl3', 'f1-cl4', 18), edge('f1-cl4', 'f1-cl5', 13),
  edge('f1-cl5', 'f1-jbl', 6),
  // Right corridor spine
  edge('f1-cr1', 'f1-cr2', 15), edge('f1-cr2', 'f1-cr3', 17),
  edge('f1-cr3', 'f1-cr4', 18), edge('f1-cr4', 'f1-cr5', 13),
  edge('f1-cr5', 'f1-jbr', 6),
  // Bottom corridor
  edge('f1-jbl', 'f1-cb1', 9), edge('f1-cb1', 'f1-cb2', 20),
  edge('f1-cb2', 'f1-cb3', 20), edge('f1-cb3', 'f1-cb4', 20),
  edge('f1-cb4', 'f1-jbr', 12),
  // Stairs
  edge('f1-stairs', 'f1-cl3', 9),
  // Left rooms → corridor
  edge('f1-cl1', 'f1-sve106', 6), edge('f1-cl1', 'f1-sve105', 6),
  edge('f1-cl2', 'f1-sve104', 6), edge('f1-cl2', 'f1-sv127', 6),
  edge('f1-cl3', 'f1-sv126', 6), edge('f1-cl3', 'f1-sv125', 6), edge('f1-cl3', 'f1-sv124', 6),
  edge('f1-stairs', 'f1-sv123', 7),
  edge('f1-cl4', 'f1-sv122', 6),
  edge('f1-cl5', 'f1-sv121', 6), edge('f1-cl5', 'f1-sv120', 6),
  // Bottom rooms → corridor
  edge('f1-jbl', 'f1-sv119', 7), edge('f1-cb1', 'f1-sv118a', 6),
  edge('f1-cb1', 'f1-sv118b', 8),
  edge('f1-cb1', 'f1-sv117', 9),
  edge('f1-cb2', 'f1-sv115', 4), edge('f1-cb2', 'f1-sv114', 9),
  edge('f1-cb3', 'f1-sv116', 19), edge('f1-cb3', 'f1-sv111', 6),
  edge('f1-cb3', 'f1-sv110', 7),
  edge('f1-cb4', 'f1-sv109', 6), edge('f1-jbr', 'f1-sv108', 7),
  // Right rooms → corridor
  edge('f1-cr1', 'f1-sve101', 6), edge('f1-cr1', 'f1-sve102', 6),
  edge('f1-cr2', 'f1-sve103', 6), edge('f1-cr2', 'f1-sv101', 6),
  edge('f1-cr3', 'f1-sv102', 6), edge('f1-cr3', 'f1-sv103', 6),
  edge('f1-cr4', 'f1-sv104', 6), edge('f1-cr4', 'f1-sv105', 6),
  edge('f1-cr5', 'f1-sv106', 6), edge('f1-cr5', 'f1-sv107', 6),
];

// ──────────────────────────────────────────────
// SECOND FLOOR (floor 2)
// ──────────────────────────────────────────────
const secondLocations = [
  { locationId: 'f2-sve206', name: 'SVE 206', floor: 2, x: 5, y: 4, type: 'room', label: 'TINKER CAD LAB' },
  { locationId: 'f2-sve205', name: 'SVE 205', floor: 2, x: 5, y: 11, type: 'room', label: 'Staff Room 2' },
  { locationId: 'f2-sve204', name: 'SVE 204', floor: 2, x: 5, y: 18, type: 'office', label: 'ECE HOD Office', metadata: { department: 'ECE' } },
  { locationId: 'f2-sv222',  name: 'SV 222', floor: 2, x: 5, y: 25, type: 'classroom', label: 'IV ECE-B' },
  { locationId: 'f2-sv221',  name: 'SV 221', floor: 2, x: 5, y: 32, type: 'classroom', label: 'IV ECE-A' },
  { locationId: 'f2-sv220',  name: 'SV 220', floor: 2, x: 5, y: 39, type: 'classroom', label: 'III ECE-B' },
  { locationId: 'f2-sv219',  name: 'SV 219', floor: 2, x: 5, y: 46, type: 'classroom', label: 'III ECE-A' },
  { locationId: 'f2-sv218a', name: 'SV 218A', floor: 2, x: 5, y: 53, type: 'lab', label: 'LDICA LAB & MICROWAVE LAB' },
  { locationId: 'f2-sv218b', name: 'SV 218B', floor: 2, x: 5, y: 60, type: 'office', label: 'ECE VICE HOD CABIN' },
  { locationId: 'f2-sv217',  name: 'SV 217', floor: 2, x: 5, y: 67, type: 'store', label: 'Store Room' },
  { locationId: 'f2-sv216',  name: 'SV 216', floor: 2, x: 5, y: 74, type: 'washroom', label: 'Ladies Washroom' },
  { locationId: 'f2-sv215',  name: 'SV 215', floor: 2, x: 5, y: 81, type: 'room', label: 'DSP LAB' },
  { locationId: 'f2-sv214',  name: 'SV 214', floor: 2, x: 14, y: 81, type: 'lab', label: 'MPMC Lab' },
  { locationId: 'f2-sv213',  name: 'SV 213', floor: 2, x: 23, y: 81, type: 'classroom', label: 'II ECE-B' },
  { locationId: 'f2-sv212',  name: 'SV 212', floor: 2, x: 32, y: 81, type: 'classroom', label: 'II ECE-A' },
  { locationId: 'f2-sv211',  name: 'SV 211', floor: 2, x: 41, y: 81, type: 'room', label: 'Staff Room' },
  { locationId: 'f2-stairs-h1', name: 'Stairs', floor: 2, x: 50, y: 81, type: 'stairs', label: 'Stairs' },
  { locationId: 'f2-sv210',  name: 'SV 210', floor: 2, x: 59, y: 81, type: 'room', label: 'ANALOG CIRCUITS LAB' },
  { locationId: 'f2-sv209',  name: 'SV 208 & 209', floor: 2, x: 68, y: 81, type: 'room', label: 'EDC LAB' },
  { locationId: 'f2-sv207',  name: 'SV 207', floor: 2, x: 77, y: 81, type: 'room' },
  { locationId: 'f2-sv-gents', name: 'Gents Washroom', floor: 2, x: 86, y: 81, type: 'washroom', label: 'Gents Washroom' },
  { locationId: 'f2-stairs-sv203', name: 'Stairs SV 203', floor: 2, x: 92, y: 46, type: 'stairs', label: 'Stairs' },
  { locationId: 'f2-sve201', name: 'SVE 201', floor: 2, x: 98, y: 4, type: 'room' },
  { locationId: 'f2-sve202', name: 'SVE 202', floor: 2, x: 98, y: 11, type: 'room' },
  { locationId: 'f2-sve203', name: 'SVE 203', floor: 2, x: 98, y: 18, type: 'room' },
  { locationId: 'f2-sv200',  name: 'SV 200', floor: 2, x: 98, y: 25, type: 'room' },
  { locationId: 'f2-sv201',  name: 'SV 201', floor: 2, x: 98, y: 32, type: 'room' },
  { locationId: 'f2-sv202',  name: 'SV 202', floor: 2, x: 98, y: 39, type: 'room' },
  { locationId: 'f2-sv203',  name: 'SV 203', floor: 2, x: 98, y: 46, type: 'room' },
  { locationId: 'f2-sv204',  name: 'SV 204', floor: 2, x: 98, y: 53, type: 'room' },
  { locationId: 'f2-sv205',  name: 'SV 205', floor: 2, x: 98, y: 60, type: 'room' },
  { locationId: 'f2-sv206r', name: 'SV 206', floor: 2, x: 98, y: 67, type: 'lab', label: 'IOT Lab' },
  // Corridors
  { locationId: 'f2-cl1', name: 'L-Corridor Top', floor: 2, x: 11, y: 5, type: 'corridor' },
  { locationId: 'f2-cl2', name: 'L-Corridor Mid-Up', floor: 2, x: 11, y: 20, type: 'corridor' },
  { locationId: 'f2-cl3', name: 'L-Corridor Mid', floor: 2, x: 11, y: 37, type: 'corridor' },
  { locationId: 'f2-cl4', name: 'L-Corridor Mid-Low', floor: 2, x: 11, y: 55, type: 'corridor' },
  { locationId: 'f2-cl5', name: 'L-Corridor Bottom', floor: 2, x: 11, y: 67, type: 'corridor' },
  { locationId: 'f2-cr1', name: 'R-Corridor Top', floor: 2, x: 92, y: 5, type: 'corridor' },
  { locationId: 'f2-cr2', name: 'R-Corridor Mid-Up', floor: 2, x: 92, y: 20, type: 'corridor' },
  { locationId: 'f2-cr3', name: 'R-Corridor Mid', floor: 2, x: 92, y: 37, type: 'corridor' },
  { locationId: 'f2-cr4', name: 'R-Corridor Mid-Low', floor: 2, x: 92, y: 55, type: 'corridor' },
  { locationId: 'f2-cr5', name: 'R-Corridor Bottom', floor: 2, x: 92, y: 68, type: 'corridor' },
  { locationId: 'f2-jbl', name: 'Junction Bottom-Left', floor: 2, x: 11, y: 73, type: 'corridor' },
  { locationId: 'f2-jbr', name: 'Junction Bottom-Right', floor: 2, x: 92, y: 73, type: 'corridor' },
  { locationId: 'f2-cb1', name: 'Bottom Corridor 1', floor: 2, x: 20, y: 73, type: 'corridor' },
  { locationId: 'f2-cb2', name: 'Bottom Corridor 2', floor: 2, x: 40, y: 73, type: 'corridor' },
  { locationId: 'f2-cb3', name: 'Bottom Corridor 3', floor: 2, x: 60, y: 73, type: 'corridor' },
  { locationId: 'f2-cb4', name: 'Bottom Corridor 4', floor: 2, x: 80, y: 73, type: 'corridor' },
  { locationId: 'f2-stairs', name: 'Second Floor Stairs', floor: 2, x: 12, y: 46, type: 'stairs', label: 'Stairs' },
];

const secondEdges = [
  edge('f2-cl1', 'f2-cl2', 15), edge('f2-cl2', 'f2-cl3', 17),
  edge('f2-cl3', 'f2-cl4', 18), edge('f2-cl4', 'f2-cl5', 12),
  edge('f2-cl5', 'f2-jbl', 6),
  edge('f2-cr1', 'f2-cr2', 15), edge('f2-cr2', 'f2-cr3', 17),
  edge('f2-cr3', 'f2-cr4', 18), edge('f2-cr4', 'f2-cr5', 13),
  edge('f2-cr5', 'f2-jbr', 5),
  edge('f2-jbl', 'f2-cb1', 9), edge('f2-cb1', 'f2-cb2', 20),
  edge('f2-cb2', 'f2-cb3', 20), edge('f2-cb3', 'f2-cb4', 20),
  edge('f2-cb4', 'f2-jbr', 12),
  edge('f2-stairs', 'f2-cl3', 9),
  edge('f2-cl1', 'f2-sve206', 6), edge('f2-cl1', 'f2-sve205', 6),
  edge('f2-cl2', 'f2-sve204', 6), edge('f2-cl2', 'f2-sv222', 6),
  edge('f2-cl3', 'f2-sv221', 6), edge('f2-cl3', 'f2-sv220', 6),
  edge('f2-stairs', 'f2-sv219', 4),
  edge('f2-cl4', 'f2-sv218a', 4), edge('f2-cl4', 'f2-sv218b', 6),
  edge('f2-cl5', 'f2-sv216', 6),
  edge('f2-sv216', 'f2-sv215', 5), 
  edge('f2-cb1', 'f2-sv215', 5), 
  edge('f2-cb1', 'f2-sv214', 6),
  edge('f2-cb1', 'f2-sv213', 7), edge('f2-cb2', 'f2-sv212', 7),
  edge('f2-cb2', 'f2-sv211', 7),
  edge('f2-cb2', 'f2-stairs-h1', 5),
  edge('f2-stairs-h1', 'f2-cb3', 5),
  edge('f2-cb3', 'f2-sv210', 7), edge('f2-cb3', 'f2-sv209', 10),
  edge('f2-jbr', 'f2-sv207', 5), edge('f2-jbr', 'f2-sv-gents', 4),
  edge('f2-cr1', 'f2-sve201', 6), edge('f2-cr1', 'f2-sve202', 6),
  edge('f2-cr2', 'f2-sve203', 6), edge('f2-cr2', 'f2-sv200', 6),
  edge('f2-cr3', 'f2-sv201', 6), edge('f2-cr3', 'f2-sv202', 6),
  edge('f2-cr4', 'f2-sv203', 6), edge('f2-cr4', 'f2-sv204', 6),
  edge('f2-stairs-sv203', 'f2-cr4', 3),
  edge('f2-cr5', 'f2-sv205', 6), edge('f2-cr5', 'f2-sv206r', 6),
];

// ──────────────────────────────────────────────
// THIRD FLOOR (floor 3)
// ──────────────────────────────────────────────
const thirdLocations = [
  { locationId: 'f3-sve304', name: 'SVE 304', floor: 3, x: 6, y: 8, type: 'room' },
  { locationId: 'f3-sv322',  name: 'SV 322', floor: 3, x: 5, y: 23, type: 'room' },
  { locationId: 'f3-sv321',  name: 'SV 321', floor: 3, x: 5, y: 31, type: 'room' },
  { locationId: 'f3-sv320',  name: 'SV 320', floor: 3, x: 5, y: 39, type: 'room' },
  { locationId: 'f3-sv319',  name: 'SV 319', floor: 3, x: 5, y: 45, type: 'office', label: 'HAS HOD' },
  { locationId: 'f3-sv316',  name: 'SV 316-318', floor: 3, x: 5, y: 63, type: 'room' },
  { locationId: 'f3-sv315',  name: 'SV 315', floor: 3, x: 5, y: 77, type: 'room' },
  { locationId: 'f3-sv314',  name: 'SV 314', floor: 3, x: 6, y: 85, type: 'room' },
  { locationId: 'f3-sv313',  name: 'SV 313', floor: 3, x: 17, y: 84, type: 'room', label: 'Staff Room 2' },
  { locationId: 'f3-sv312',  name: 'SV 312', floor: 3, x: 27, y: 84, type: 'room' },
  { locationId: 'f3-sv311',  name: 'SV 311', floor: 3, x: 35, y: 84, type: 'room' },
  { locationId: 'f3-sv310',  name: 'SV 310', floor: 3, x: 43, y: 84, type: 'room', label: 'Staff Room 1' },
  { locationId: 'f3-sv309',  name: 'SV 309', floor: 3, x: 52, y: 84, type: 'room' },
  { locationId: 'f3-sv308',  name: 'SV 308', floor: 3, x: 61, y: 84, type: 'room' },
  { locationId: 'f3-sv307',  name: 'SV 307', floor: 3, x: 69, y: 84, type: 'room' },
  { locationId: 'f3-sv306',  name: 'SV 306', floor: 3, x: 77, y: 84, type: 'room' },
  { locationId: 'f3-sv305',  name: 'SV 304 & 305', floor: 3, x: 91, y: 85, type: 'room' },
  { locationId: 'f3-sve301', name: 'SVE 301', floor: 3, x: 96, y: 8, type: 'room' },
  { locationId: 'f3-sv301',  name: 'SV 301', floor: 3, x: 98, y: 59, type: 'library', label: 'Library' },
  { locationId: 'f3-sv302',  name: 'SV 302', floor: 3, x: 98, y: 77, type: 'library', label: 'Digital Library' },
  { locationId: 'f3-sv303',  name: 'SV 303', floor: 3, x: 98, y: 81, type: 'room' },
  // Corridors
  { locationId: 'f3-cl1', name: 'L-Corridor Upper', floor: 3, x: 11, y: 10, type: 'corridor' },
  { locationId: 'f3-cl2', name: 'L-Corridor Mid-Up', floor: 3, x: 11, y: 25, type: 'corridor' },
  { locationId: 'f3-cl3', name: 'L-Corridor Mid', floor: 3, x: 11, y: 37, type: 'corridor' },
  { locationId: 'f3-cl4', name: 'L-Corridor Mid-Low', floor: 3, x: 11, y: 55, type: 'corridor' },
  { locationId: 'f3-cl5', name: 'L-Corridor Bottom', floor: 3, x: 11, y: 73, type: 'corridor' },
  { locationId: 'f3-cr1', name: 'R-Corridor Upper', floor: 3, x: 92, y: 10, type: 'corridor' },
  { locationId: 'f3-cr2', name: 'R-Corridor Mid', floor: 3, x: 92, y: 40, type: 'corridor' },
  { locationId: 'f3-cr3', name: 'R-Corridor Mid-Low', floor: 3, x: 92, y: 60, type: 'corridor' },
  { locationId: 'f3-cr4', name: 'R-Corridor Bottom', floor: 3, x: 92, y: 75, type: 'corridor' },
  { locationId: 'f3-jbl', name: 'Junction Bottom-Left', floor: 3, x: 11, y: 78, type: 'corridor' },
  { locationId: 'f3-jbr', name: 'Junction Bottom-Right', floor: 3, x: 92, y: 78, type: 'corridor' },
  { locationId: 'f3-cb1', name: 'Bottom Corridor 1', floor: 3, x: 20, y: 78, type: 'corridor' },
  { locationId: 'f3-cb2', name: 'Bottom Corridor 2', floor: 3, x: 40, y: 78, type: 'corridor' },
  { locationId: 'f3-cb3', name: 'Bottom Corridor 3', floor: 3, x: 60, y: 78, type: 'corridor' },
  { locationId: 'f3-cb4', name: 'Bottom Corridor 4', floor: 3, x: 80, y: 78, type: 'corridor' },
  { locationId: 'f3-stairs', name: 'Third Floor Stairs', floor: 3, x: 12, y: 46, type: 'stairs', label: 'Stairs' },
];

const thirdEdges = [
  edge('f3-cl1', 'f3-cl2', 15), edge('f3-cl2', 'f3-cl3', 12),
  edge('f3-cl3', 'f3-cl4', 18), edge('f3-cl4', 'f3-cl5', 18),
  edge('f3-cl5', 'f3-jbl', 5),
  edge('f3-cr1', 'f3-cr2', 30), edge('f3-cr2', 'f3-cr3', 20),
  edge('f3-cr3', 'f3-cr4', 15), edge('f3-cr4', 'f3-jbr', 3),
  edge('f3-jbl', 'f3-cb1', 9), edge('f3-cb1', 'f3-cb2', 20),
  edge('f3-cb2', 'f3-cb3', 20), edge('f3-cb3', 'f3-cb4', 20),
  edge('f3-cb4', 'f3-jbr', 12),
  edge('f3-stairs', 'f3-cl3', 9),
  edge('f3-cl1', 'f3-sve304', 5),
  edge('f3-cl2', 'f3-sv322', 6), edge('f3-cl2', 'f3-sv321', 6),
  edge('f3-cl3', 'f3-sv320', 6), edge('f3-stairs', 'f3-sv319', 7),
  edge('f3-cl4', 'f3-sv316', 6), edge('f3-cl5', 'f3-sv315', 6),
  edge('f3-jbl', 'f3-sv314', 7), edge('f3-cb1', 'f3-sv313', 6),
  edge('f3-cb1', 'f3-sv312', 7), edge('f3-cb2', 'f3-sv311', 6),
  edge('f3-cb2', 'f3-sv310', 6), edge('f3-cb3', 'f3-sv309', 6),
  edge('f3-cb3', 'f3-sv308', 6), edge('f3-cb3', 'f3-sv307', 9),
  edge('f3-cb4', 'f3-sv306', 6), edge('f3-jbr', 'f3-sv305', 7),
  edge('f3-cr1', 'f3-sve301', 5), edge('f3-cr2', 'f3-sv301', 6),
  edge('f3-cr4', 'f3-sv302', 6), edge('f3-cr4', 'f3-sv303', 6),
];

// ──────────────────────────────────────────────
// STAIR CONNECTIONS (cross-floor edges)
// ──────────────────────────────────────────────
const stairEdges = [
  edge('g-stairs', 'f1-stairs', 15),
  edge('f1-stairs', 'f2-stairs', 15),
  edge('f2-stairs', 'f3-stairs', 15),
];

// ──────────────────────────────────────────────
// SEED FUNCTION
// ──────────────────────────────────────────────
async function seed() {
  await connectDB();

  console.log('🗑️  Clearing existing data...');
  await Location.deleteMany({});
  await Floor.deleteMany({});

  console.log('🏗️  Inserting floors...');
  await Floor.insertMany(floors);

  // Combine all locations
  const allLocations = [
    ...groundLocations,
    ...firstLocations,
    ...secondLocations,
    ...thirdLocations,
  ];

  // Combine all edges
  const allEdges = [
    ...groundEdges,
    ...firstEdges,
    ...secondEdges,
    ...thirdEdges,
    ...stairEdges,
  ];

  // Build adjacency lists
  const adjacencyMap = {};
  for (const loc of allLocations) {
    adjacencyMap[loc.locationId] = [];
  }

  for (const { a, b, w } of allEdges) {
    if (adjacencyMap[a]) adjacencyMap[a].push({ targetId: b, weight: w });
    if (adjacencyMap[b]) adjacencyMap[b].push({ targetId: a, weight: w });
  }

  // Attach adjacency to locations
  const locationsWithAdj = allLocations.map((loc) => ({
    ...loc,
    adjacency: adjacencyMap[loc.locationId] || [],
  }));

  console.log(`📍 Inserting ${locationsWithAdj.length} locations...`);
  await Location.insertMany(locationsWithAdj);

  console.log(`✅ Seed complete!`);
  console.log(`   Floors: ${floors.length}`);
  console.log(`   Locations: ${locationsWithAdj.length}`);
  console.log(`   Edges: ${allEdges.length}`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
