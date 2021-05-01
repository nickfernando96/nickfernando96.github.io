export class cursos {
    id=0;
    full_price: number;
    price_with_discount: number;
    discount_percentage: number;
    start_date: string;
    enrollment_semester: string;
    enabled: boolean;
    course: Course = new Course();
    university: university = new university();
    campus: campus = new campus();
}

class Course {
    name: string;
    kind: string;
    level: string;
    shift: string;
}

class university {
    name: string;
    score: number;
    logo_url: string;
}

class campus {
    name: string;
    city: string;
}