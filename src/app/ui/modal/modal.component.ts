import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigModel, ColorsModel, THEMES, LIFE } from 'src/app/models/config.model';
import { RLEModel, RLEPreviewModel } from 'src/app/models/menu.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @ViewChild('previewer', { static: true })
  previewer: ElementRef<HTMLCanvasElement>;
  private previewerCtx: CanvasRenderingContext2D;

  @Input() type: string;
  @Input() config: ConfigModel;
  @Input() exportRle: any;
  data: Blob;
  url: string;

  @Output() exit: EventEmitter<null> = new EventEmitter();
  @Output() colorsUpdate: EventEmitter<ColorsModel> = new EventEmitter();
  @Output() lifeRle: EventEmitter<RLEModel> = new EventEmitter();
  @Output() lifeLoad: EventEmitter<string> = new EventEmitter();
  @Output() lifeSave: EventEmitter<string> = new EventEmitter();
  @Output() lifeDelete: EventEmitter<number> = new EventEmitter();

  modalForm: FormGroup;
  selected: number;

  rle: RLEModel;
  shouldValidate = true;
  rlePreview: RLEPreviewModel = {
    rleReady: false,
    flippedX: false,
    flippedY: false,
    rotation: 0,
    pre: {
      x: 20,
      y: 20,
      code: this.startRlePreviewCode()
    }
  };

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initModal();
    setTimeout(() => {
      if (this.type === 'RLE' && this.exportRle) {
        this.data = new Blob([this.exportRle.code], {type: 'text/plain'});
        this. url = window.URL.createObjectURL(this.data);
        (document.getElementById('downloadRle') as HTMLAnchorElement).href = this.url;
        (document.getElementById('downloadTxt') as HTMLAnchorElement).href = this.url;
      }
    });
  }

  initModal(): void {
    if (this.type === 'colors') {
      this.modalForm = this.formBuilder.group({
        alive: [ this.config.colors.alive ],
        dead: [ this.config.colors.dead ],
        grid: [ this.config.colors.grid ],
        lines: [ this.config.colors.lines ]
      });
      this.initPreviewer();
      return;
    }
    if (this.type === 'RLE') {
      this.modalForm = this.formBuilder.group({
        rle: [ '' ]
      });
      this.initPreviewer();
      this.modalForm.get('rle').valueChanges.subscribe(v => {
        if (this.shouldValidate) {
          this.shouldValidate = false;
          this.rlePreview.rleReady = this.validateRleAndProcess();
          if (this.rlePreview.rleReady) {
            this.modalForm.get('rle').patchValue('Success');
          } else {
            this.rle = null;
            this.modalForm.get('rle').patchValue('Error');
          }
          this.updatePreviewer();
        } else {
          this.shouldValidate = true;
        }
      });
      return;
    }
    this.modalForm = this.formBuilder.group({
      id: [ null ],
      name: [ 'New Pattern', Validators.required ],
      pop: [ null ],
      size: [ null ],
      lastUpdate: [ null ],
      oX: [ null ],
      oY: [ null ],
      oGrid: [ null ],
    });
  }

  selectFile(idx?: number): void {
    if (idx == null) {
      this.selected = -1;
      return;
    }
    this.selected = idx;
    this.modalForm.get('name').patchValue('New Life');
  }

  resetColors(theme: number): void {
    this.modalForm.patchValue(THEMES[theme]);
    this.updatePreviewer();
  }

  updateColors(): void {
    this.colorsUpdate.emit(this.modalForm.value);
  }

  loadFile(): void {
    if (this.selected == null) {
      return;
    }
    this.lifeLoad.emit(this.config.universes[this.selected].id);
  }

  saveFile(): void {
    if (this.selected == null) {
      return;
    }
    if (this.selected !== -1) {
      this.modalForm.patchValue(this.config.universes[this.selected]);
    }
    if (this.modalForm.invalid) {
      return;
    }
    this.lifeSave.emit(this.modalForm.value);
  }

  deleteFile(idx: number): void {
    this.lifeDelete.emit(idx);
  }

  validateRleAndProcess(): boolean {
    this.rlePreview.flippedX = false;
    this.rlePreview.flippedY = false;
    this.rlePreview.rotation = 0;
    this.rlePreview.pre.code = this.startRlePreviewCode();
    this.updatePreviewer();

    if (this.modalForm.invalid) {
      return false;
    }
    const rleInput: string = this.modalForm.get('rle').value;
    if (!this.validChars(rleInput)) {
      return false;
    }
    const rleEntries: string[] = rleInput.replace(/ /g, '').split(',');
    if (!this.validEntries(rleEntries)) {
      return false;
    }
    let code = rleEntries[2];
    const x: number = parseInt(rleEntries[0].slice(2), 10);
    const y: number = parseInt(rleEntries[1].slice(2), 10);
    if (rleEntries[2].slice(0, 5).toLowerCase() === 'rule=') {
      if (rleEntries[2].slice(5, 11).toLowerCase() !== 'b3/s23') {
        return false;
      }
      code = rleEntries[2].slice(11);
    }
    if (!this.validCode(x, y, code) || this.rle.x > LIFE.x - 2 * LIFE.o || this.rle.y > LIFE.y - 2 * LIFE.o) {
      return false;
    }
    return true;
  }

  validChars(inputString: string): boolean {
    const invalidChars: string = inputString.toLowerCase()
      .replace(/ /g, '')
      .replace(/,/g, '')
      .replace('rule=b3/s23', '')
      .replace('x=', '')
      .replace('y=', '')
      .replace(/b/g, '')
      .replace(/o/g, '')
      .replace(/\$/g, '')
      .replace('!', '')
      .replace(/^[0-9]*$/, '');

    if (invalidChars.length > 0) {
      return false;
    }
    return true;
  }

  validEntries(entries: string[]): boolean {
    if (entries[0].slice(0, 2) !== 'x=' || entries[1].slice(0, 2) !== 'y=') {
      return false;
    }
    if (!/^[0-9]*$/.test(entries[0].slice(2)) || !/^[0-9]*$/.test(entries[1].slice(2))) {
      return false;
    }
    return true;
  }

  validCode(x: number, y: number, code: string): boolean {
    const codeEmptyLines = this.insertEmptyLines(x, y, code);
    console.log(codeEmptyLines);
    const splitLines: string[] = codeEmptyLines.split('$');
    const decodedRle: string[] = [];
    splitLines.forEach(line => {
      let decoded = '';
      let numString = '';
      for (let i = 0; i < line.length; i++) {
        if (/^[0-9]*$/.test(line.charAt(i))) {
          numString = `${numString}${line.charAt(i)}`;
        } else {
          let parsedNum = 1;
          if (numString.length > 0) {
            parsedNum = parseInt(numString, 10);
            numString = '';
          }
          for (let j = 0; j < parsedNum; j ++) {
            decoded = `${decoded}${line.charAt(i) === '!' ? '' : (line.charAt(i) === 'o') ? '1' : '0'}`;
          }
        }
      }
      if (decoded.length < x) {
        const zLen = decoded.length;
        for (let i = zLen; i < x; i++) {
          decoded = `${decoded}0`;
        }
      }
      decodedRle.push(decoded);
      decoded = '';
    });
    if (decodedRle.length > y) {
      return false;
    }
    for (const line of decodedRle) {
      if (line.length > x) {
        return false;
      }
    }
    this.rle = {
      x, y,
      code: decodedRle
    };
    return true;
  }

  insertEmptyLines(x: number, y: number, code: string): string {
    let decoded = '';
    let numString = '';
    for (let i = 0; i < code.length; i++) {
      if (/^[0-9]*$/.test(code.charAt(i))) {
        numString = `${numString}${code.charAt(i)}`;
      } else {
        let parsedNum = 1;
        if (numString.length > 0) {
          parsedNum = parseInt(numString, 10);
          numString = '';
        }
        if (/\$/.test(code.charAt(i))) {
          for (let yk = 0; yk < parsedNum; yk++) {
            decoded = `${decoded}${parsedNum === 1 ? '$' : 'b$'}`;
          }
        } else {
          decoded = `${decoded}${parsedNum > 1 ? parsedNum : ''}${code.charAt(i)}`;
        }
      }
    }
    return decoded;
  }

  flipPatternX(): void {
    const pattern: RLEModel = {
      x: this.rle.x,
      y: this.rle.y,
      code: Array.from({length: this.rle.y}).map(v => '')
    };
    const preCode = Array.from({length: this.rlePreview.pre.y}).map(v => '');
    for (let yi = pattern.y - 1; yi >= 0 ; yi--) {
      for (let xi = 0; xi < pattern.x; xi++) {
        pattern.code[pattern.y - yi] = `${pattern.code[pattern.y - yi]}${this.rle.code[yi].charAt(xi)}`;
      }
    }
    for (let yi = this.rlePreview.pre.y - 1; yi >= 0 ; yi--) {
      for (let xi = 0; xi < this.rlePreview.pre.x; xi++) {
        preCode[this.rlePreview.pre.y - yi] = `${preCode[this.rlePreview.pre.y - yi]}${this.rlePreview.pre.code[yi].charAt(xi)}`;
      }
    }
    this.rle = pattern;
    this.rlePreview.pre.code = preCode;
    this.rlePreview.flippedX = !this.rlePreview.flippedX;
    this.updatePreviewer();
  }

  flipPatternY(): void {
    const pattern: RLEModel = {
      x: this.rle.x,
      y: this.rle.y,
      code: Array.from({length: this.rle.y}).map(v => '')
    };
    const preCode = Array.from({length: this.rlePreview.pre.y}).map(v => '');
    for (let xi = pattern.x - 1; xi >= 0 ; xi--) {
      for (let yi = 0; yi < pattern.y; yi++) {
        pattern.code[yi] = `${pattern.code[yi]}${this.rle.code[yi].charAt(xi)}`;
      }
    }
    for (let xi = this.rlePreview.pre.x - 1; xi >= 0 ; xi--) {
      for (let yi = 0; yi < this.rlePreview.pre.y; yi++) {
        preCode[yi] = `${preCode[yi]}${this.rlePreview.pre.code[yi].charAt(xi)}`;
      }
    }
    this.rle = pattern;
    this.rlePreview.pre.code = preCode;
    this.rlePreview.flippedY = !this.rlePreview.flippedY;
    this.updatePreviewer();
  }

  startRle(): void {
    this.lifeRle.emit(this.rle);
  }

  initPreviewer(): void {
    this.previewer.nativeElement.width = 201;
    this.previewer.nativeElement.height = 201;
    this.previewerCtx = this.previewer.nativeElement.getContext('2d');
    this.updatePreviewer();
  }

  updatePreviewer(): void {
    if (this.type !== 'RLE') {
      this.drawColorPreviewer();
      return;
    }
    this.drawRLEPreviewer();
  }

  drawRLEPreviewer(): void {
    this.previewerCtx.fillStyle = this.config.colors.dead;
    this.previewerCtx.fillRect(0, 0, 201, 201);
    if (this.rle) {
      this.previewerCtx.fillStyle = this.config.colors.alive;
      for (let yi = 0; yi < this.rlePreview.pre.y; yi++) {
        for (let xi = 0; xi < this.rlePreview.pre.x; xi++) {
          if (this.rlePreview.pre.code[yi].charAt(xi) === '1') {
            this.previewerCtx.fillRect(xi * 10 + 1, yi * 10 + 1, 10, 10);
          }
        }
      }
    }
    this.previewerCtx.fillStyle = this.config.colors.grid;
    this.previewerCtx.fillRect(0, 0, 1, 200);
    this.previewerCtx.fillRect(0, 0, 200, 1);
    for (let i = 10; i <= 200; i += 10) {
      this.previewerCtx.fillRect(i, 0, 1, 200);
      this.previewerCtx.fillRect(0, i, 201, 1);
    }
    this.previewerCtx.fillStyle = this.config.colors.lines;
    this.previewerCtx.fillRect(20, 0, 1, 200);
    this.previewerCtx.fillRect(70, 0, 1, 200);
    this.previewerCtx.fillRect(120, 0, 1, 200);
    this.previewerCtx.fillRect(170, 0, 1, 200);
    this.previewerCtx.fillRect(0, 30, 201, 1);
    this.previewerCtx.fillRect(0, 80, 201, 1);
    this.previewerCtx.fillRect(0, 130, 201, 1);
    this.previewerCtx.fillRect(0, 180, 201, 1);
  }

  drawColorPreviewer(): void {
    this.previewerCtx.fillStyle = this.modalForm.get('dead').value;
    this.previewerCtx.fillRect(0, 0, 201, 201);
    this.previewerCtx.fillStyle = this.modalForm.get('alive').value;
    this.previewerCtx.fillRect(91, 91, 10, 10);
    this.previewerCtx.fillRect(101, 101, 10, 10);
    this.previewerCtx.fillRect(101, 111, 10, 10);
    this.previewerCtx.fillRect(91, 111, 10, 10);
    this.previewerCtx.fillRect(81, 111, 10, 10);
    this.previewerCtx.fillStyle = this.modalForm.get('grid').value;
    this.previewerCtx.fillRect(0, 0, 1, 200);
    this.previewerCtx.fillRect(0, 0, 200, 1);
    for (let i = 10; i <= 200; i += 10) {
      this.previewerCtx.fillRect(i, 0, 1, 200);
      this.previewerCtx.fillRect(0, i, 201, 1);
    }
    this.previewerCtx.fillStyle = this.modalForm.get('lines').value;
    this.previewerCtx.fillRect(20, 0, 1, 200);
    this.previewerCtx.fillRect(70, 0, 1, 200);
    this.previewerCtx.fillRect(120, 0, 1, 200);
    this.previewerCtx.fillRect(170, 0, 1, 200);
    this.previewerCtx.fillRect(0, 30, 201, 1);
    this.previewerCtx.fillRect(0, 80, 201, 1);
    this.previewerCtx.fillRect(0, 130, 201, 1);
    this.previewerCtx.fillRect(0, 180, 201, 1);
  }

  startRlePreviewCode(): string[] {
    return [
      '00000000000000000000',
      '00000000000000000000',
      '00000000000000000000',
      '00000000000000000000',
      '00000000000000000000',
      '00000000000000000000',
      '00000000000000000000',
      '00000000000000000000',
      '00100001001110011100',
      '00100001001000010000',
      '00100001001100011000',
      '00100001001000010000',
      '00111001001000011100',
      '00000000000000000000',
      '00000000000000000000',
      '00000000000000000000',
      '00000000000000000000',
      '00000000000000000000',
      '00000000000000000000',
      '00000000000000000000'
    ];
  }
}
